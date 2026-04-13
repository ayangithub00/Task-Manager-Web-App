from rest_framework import serializers
from .models import ProjectModel
from django.contrib.auth import get_user_model

User = get_user_model()


class MemberSerializer(serializers.ModelSerializer):
    # SerializerMethodField lets us write custom logic for a field.
    # We use it here for "role" because if a user was created before the role
    # field existed (or has an empty/null role), we default to "member"
    # instead of returning null — which would break the frontend dropdown.
    role = serializers.SerializerMethodField()

    def get_role(self, obj):
        # obj is the User instance
        # Return the role if it exists, otherwise default to "member"
        return obj.role if obj.role else "member"

    class Meta:
        model = User
        fields = ["id", "username", "role"]


class ProjectSerializers(serializers.ModelSerializer):
    owner_username = serializers.CharField(
        source="created_by.username",
        read_only=True
    )
    members = MemberSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectModel
        fields = ["id", "name", "description", "owner_username", "members", "created_at"]