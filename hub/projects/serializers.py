from rest_framework import serializers
from .models import ProjectModel


class ProjectSerializers(serializers.ModelSerializer):
    username = serializers.CharField(source="created_by.username")
    members = serializers.StringRelatedField(many=True,read_only=True)
    class Meta:
        model = ProjectModel
        fields = ["id", "name", "description", "username", "members", "created_at"]
        
        

