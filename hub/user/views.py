from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

# Django date utilities for grouping tasks by day/week
from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate

import datetime

from .models import User
from projects.models import ProjectModel
from tasks.models import TaskModel
from .serializers import RegisterSerializer, ProfileSerializer, UserListSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Invalid token or already logged out"}, status=400)


# ─────────────────────────────────────────────
# DASHBOARD VIEW — now returns REAL chart data
# ─────────────────────────────────────────────

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ── BASIC STATS ──
        # These were already here — counts for the stat cards at the top
        total_projects = ProjectModel.objects.filter(created_by=user).count()
        assigned_tasks = TaskModel.objects.filter(assigned_to=user).count()
        completed_tasks = TaskModel.objects.filter(assigned_to=user, status="Done").count()

        # ── WEEKLY ACTIVITY DATA (for the Area Chart) ──
        #
        # Goal: return [{name: "Mon", tasks: 3}, {name: "Tue", tasks: 7}, ...]
        # representing how many tasks were COMPLETED each day this week.
        #
        # How it works:
        # 1. Find the start of this week (Monday at 00:00)
        # 2. Find today's date
        # 3. Query tasks where completed_at falls within this week
        # 4. Group them by day using TruncDate + annotate(Count)
        # 5. Fill in 0 for any days with no completions

        today = timezone.now().date()

        # Monday of this week (weekday() returns 0 for Monday, 6 for Sunday)
        start_of_week = today - datetime.timedelta(days=today.weekday())

        # All 7 days of this week as date objects: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
        week_days = [start_of_week + datetime.timedelta(days=i) for i in range(7)]

        # Short day names for the chart x-axis labels
        day_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

        # Query: tasks completed this week by this user, grouped by day
        # TruncDate("completed_at") truncates the datetime to just the date part
        # annotate(count=Count("id")) adds a count of tasks per day
        completions_this_week = (
            TaskModel.objects
            .filter(
                assigned_to=user,
                status="Done",
                completed_at__gte=start_of_week,   # from Monday
                completed_at__lte=today,            # up to today
            )
            .annotate(day=TruncDate("completed_at"))
            .values("day")                          # group by day
            .annotate(count=Count("id"))            # count tasks per day
        )

        # Build a dict {date_object: count} for easy lookup
        # e.g. {datetime.date(2026, 4, 7): 3, datetime.date(2026, 4, 8): 1}
        completion_map = {entry["day"]: entry["count"] for entry in completions_this_week}

        # Build the final array the frontend chart expects.
        # For each day of the week, look up the count (default 0 if no completions).
        weekly_activity = [
            {
                "name": day_labels[i],                          # "Mon", "Tue", etc.
                "tasks": completion_map.get(week_days[i], 0),  # real count or 0
            }
            for i in range(7)
        ]

        # ── WEEKLY PROJECT PROGRESS DATA (for the Bar Chart) ──
        #
        # Goal: return last 4 weeks showing how many tasks were completed
        # vs how many total tasks existed, so the bar chart shows progress over time.
        #
        # How it works:
        # For each of the last 4 weeks, count:
        #   - total tasks assigned to user that existed by end of that week
        #   - completed tasks (completed_at falls within that week)

        weekly_progress = []

        for week_offset in range(3, -1, -1):
            # Start and end of this week in the loop
            # week_offset=3 → 4 weeks ago, week_offset=0 → this week
            week_start = start_of_week - datetime.timedelta(weeks=week_offset)
            week_end = week_start + datetime.timedelta(days=6)

            # Tasks created on or before the end of this week (tasks that existed then)
            total_in_week = TaskModel.objects.filter(
                assigned_to=user,
                created_at__lte=week_end,
            ).count()

            # Tasks completed within this specific week
            completed_in_week = TaskModel.objects.filter(
                assigned_to=user,
                status="Done",
                completed_at__gte=week_start,
                completed_at__lte=week_end,
            ).count()

            # Label like "Apr 7" for the x-axis
            week_label = week_start.strftime("%b %-d")

            weekly_progress.append({
                "name": week_label,
                "total": total_in_week,
                "completed": completed_in_week,
            })

        # ── TASK STATUS DISTRIBUTION (for the Pie/Donut Chart) ──
        # Real counts of tasks in each status — already accurate, just making it explicit
        task_distribution = {
            "completed": completed_tasks,
            "in_progress": TaskModel.objects.filter(assigned_to=user, status="In Progress").count(),
            "todo": TaskModel.objects.filter(assigned_to=user, status="Todo").count(),
        }

        # Return everything in one response so the frontend only needs one API call
        return Response({
            # Stat cards
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "total_projects": total_projects,
            "assigned_tasks": assigned_tasks,
            "completed_tasks": completed_tasks,

            # Chart data — all REAL, no hardcoded values
            "weekly_activity": weekly_activity,       # area chart
            "weekly_progress": weekly_progress,       # bar chart
            "task_distribution": task_distribution,   # pie/donut chart
        })


class UserListView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)