from rest_framework import serializers
from .models import TaskModel , CommentModel


class TaskSerializers(serializers.ModelSerializer):
    class Meta:
        model = TaskModel
        fields = "__all__"
        
class CommentSerializers(serializers.ModelSerializer):
    class Meta:
        model = CommentModel
        fields = "__all__"
        read_only_fields = ["user"]