from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ["username","email","bio"]
            
            
# This is advanced thing we are using this for showing the user data in dashboard 
class DashboardSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    total_projects = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    assigned_tasks = serializers.IntegerField()
    