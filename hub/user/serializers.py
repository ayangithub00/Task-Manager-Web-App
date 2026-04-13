from rest_framework import serializers
from .models import User
 
 
# ─────────────────────────────────────────────
# REGISTER SERIALIZER
# ─────────────────────────────────────────────
# This handles the data when a NEW user signs up.
# It takes username, email, password, and role from the signup form.
 
class RegisterSerializer(serializers.ModelSerializer):
 
    # write_only=True means password is accepted as input
    # but NEVER sent back in any response (for security).
    password = serializers.CharField(write_only=True)
 
    class Meta:
        model = User
        # These are the fields the signup form will send to the backend.
        # We added "role" here so users can choose owner or member on signup.
        fields = ["username", "email", "password", "role"]
 
    def create(self, validated_data):
        # create_user() is Django's built-in method that:
        # 1. Creates the user
        # 2. Hashes the password (so it's never stored as plain text)
        # We pass role here so it gets saved to the database.
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "member"),  # default to member if not provided
        )
 
 
# ─────────────────────────────────────────────
# PROFILE SERIALIZER
# ─────────────────────────────────────────────
# Used when a logged-in user views or updates their own profile.
 
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # read_only_fields means these fields are SHOWN but cannot be changed
        # through this serializer (role should not be changed after signup).
        fields = ["username", "email", "bio", "role"]
        read_only_fields = ["role"]
 
 
# ─────────────────────────────────────────────
# USER LIST SERIALIZER
# ─────────────────────────────────────────────
# This is a simple serializer used ONLY for the user-list endpoint.
# Owners need to see a list of all users so they can:
# 1. Add members to their project
# 2. Assign tasks to specific people
# We only expose id, username, and role — NOT email or password.
 
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "role"]
 
 
# ─────────────────────────────────────────────
# DASHBOARD SERIALIZER
# ─────────────────────────────────────────────
# This shapes the data returned by the /dashboard/ endpoint.
# It's a plain Serializer (not ModelSerializer) because
# the data is computed manually in the view, not from a single model.
 
class DashboardSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()         # Added role so frontend knows what UI to show
    total_projects = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    assigned_tasks = serializers.IntegerField()
 