from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.utils import timezone

from .models import TaskModel, CommentModel
from .serializers import TaskSerializers, CommentSerializers


class TaskViewset(viewsets.ModelViewSet):
    serializer_class = TaskSerializers
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

       
        queryset = TaskModel.objects.filter(
            Q(assigned_to=user) | Q(project__created_by=user)
        ).distinct()  

        project_id = self.request.query_params.get("project")
        if project_id:
            queryset = queryset.filter(project=project_id)

        return queryset

    def perform_create(self, serializer):
        project_id = self.request.data.get("project")

        from projects.models import ProjectModel
        try:
            project = ProjectModel.objects.get(id=project_id)
        except ProjectModel.DoesNotExist:
            raise PermissionDenied("Project not found.")

        if project.created_by != self.request.user:
            raise PermissionDenied("Only the project owner can create tasks.")

        serializer.save()

    def perform_update(self, serializer):
        task = self.get_object()

        if task.project.created_by != self.request.user:
            raise PermissionDenied("Only the project owner can update tasks.")

        new_status = self.request.data.get("status", task.status)

        if new_status == "Done" and task.status != "Done":
            serializer.save(completed_at=timezone.now().date())
        elif new_status != "Done" and task.status == "Done":
            serializer.save(completed_at=None)
        else:
            serializer.save()

    def perform_destroy(self, instance):
        if instance.project.created_by != self.request.user:
            raise PermissionDenied("Only the project owner can delete tasks.")
        instance.delete()

    @action(detail=False, methods=["get"])
    def stats(self, request):
        user = request.user

        queryset = TaskModel.objects.filter(
            Q(assigned_to=user) | Q(project__created_by=user)
        ).distinct()

        return Response({
            "completed": queryset.filter(status="Done").count(),
            "in_progress": queryset.filter(status="In Progress").count(),
            "todo": queryset.filter(status="Todo").count(),
            "total": queryset.count(),
        })


class CommentViewset(viewsets.ModelViewSet):
    serializer_class = CommentSerializers
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return CommentModel.objects.filter(
            Q(task__assigned_to=user) | Q(task__project__created_by=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
