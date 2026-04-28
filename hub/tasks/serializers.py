from rest_framework import serializers
from .models import TaskModel, CommentModel
 
 
# ─────────────────────────────────────────────
# TASK SERIALIZER
# ─────────────────────────────────────────────
 
class TaskSerializers(serializers.ModelSerializer):
 
    
    assigned_to_username = serializers.CharField(
        source="assigned_to.username",
        read_only=True 
    )
 
    class Meta:
        model = TaskModel
        fields = "__all__"  
 
 
# ─────────────────────────────────────────────
# COMMENT SERIALIZER
# ─────────────────────────────────────────────
 
class CommentSerializers(serializers.ModelSerializer):
 
   
    username = serializers.CharField(source="user.username", read_only=True)
 
    class Meta:
        model = CommentModel
        fields = "__all__"
        read_only_fields = ["user"]
 
