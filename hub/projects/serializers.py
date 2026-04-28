from rest_framework import serializers
from .models import ProjectModel
from django.contrib.auth import get_user_model

User = get_user_model()


class MemberSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    def get_role(self, obj):
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
