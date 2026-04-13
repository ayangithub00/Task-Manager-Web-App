from rest_framework import serializers
from .models import TaskModel, CommentModel
 
 
# ─────────────────────────────────────────────
# TASK SERIALIZER
# ─────────────────────────────────────────────
 
class TaskSerializers(serializers.ModelSerializer):
 
    # By default, assigned_to would just return a user ID number (e.g. 3).
    # This adds a read-only "assigned_to_username" field so the frontend
    # can show the actual name instead of just a number.
    # source="assigned_to.username" means: go to the assigned_to FK,
    # then get the username field from that User object.
    assigned_to_username = serializers.CharField(
        source="assigned_to.username",
        read_only=True  # only shown in responses, not required when sending data
    )
 
    class Meta:
        model = TaskModel
        fields = "__all__"  # includes all model fields + our custom assigned_to_username
 
 
# ─────────────────────────────────────────────
# COMMENT SERIALIZER
# ─────────────────────────────────────────────
 
class CommentSerializers(serializers.ModelSerializer):
 
    # Same idea — show username instead of just user ID in comment responses.
    username = serializers.CharField(source="user.username", read_only=True)
 
    class Meta:
        model = CommentModel
        fields = "__all__"
        # read_only_fields means these fields cannot be set by the request sender.
        # "user" is set automatically in perform_create (from the JWT token).
        read_only_fields = ["user"]
 