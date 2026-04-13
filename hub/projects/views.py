from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ProjectModel
from .serializers import ProjectSerializers, MemberSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializers
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # FIX: added .distinct() at the end.
        #
        # Without distinct(), Django's M2M join causes duplicate rows.
        # Example: a project with 4 members returns that project 4 times
        # because the SQL JOIN produces one row per member.
        # .distinct() tells the database to return each project only ONCE
        # regardless of how many members it has.
        return (
            ProjectModel.objects
            .filter(members=user) | ProjectModel.objects.filter(created_by=user)
        ).distinct()

    def perform_create(self, serializer):
        if self.request.user.role != 'owner':
            raise PermissionDenied("Only project owners can create projects.")

        project = serializer.save(created_by=self.request.user)
        project.members.add(self.request.user)

        # Resolve member usernames sent from the frontend and add them
        members_usernames = self.request.data.get("members", [])
        for username in members_usernames:
            try:
                member = User.objects.get(username=username)
                project.members.add(member)
            except User.DoesNotExist:
                pass  # skip invalid usernames silently

    def perform_update(self, serializer):
        project = self.get_object()
        if project.created_by != self.request.user:
            raise PermissionDenied("Only the project owner can update this project.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.created_by != self.request.user:
            raise PermissionDenied("Only the project owner can delete this project.")
        instance.delete()

    # GET /api/v1/project/{id}/members/
    # Returns [{id, username, role}] for all members of this project.
    # Used by TaskForm to populate the "Assign To" dropdown.
    @action(detail=True, methods=["get"], url_path="members")
    def members(self, request, pk=None):
        project = self.get_object()
        serializer = MemberSerializer(project.members.all(), many=True)
        return Response(serializer.data)