from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import TaskModel ,CommentModel
from .serializers import TaskSerializers , CommentSerializers
from rest_framework.decorators import action
from rest_framework.response import responses
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.response import Response

# Create your views here.

class TaskViewset(viewsets.ModelViewSet):
    serializer_class = TaskSerializers
    permission_classes = [IsAuthenticated]
    
    
    # def get_queryset(self):
    #     return TaskModel.objects.filter(assigned_to=self.request.user)

    def get_queryset(self):
     user = self.request.user
     return TaskModel.objects.filter(assigned_to=user)|TaskModel.objects.filter(project__created_by=user)


    # ✅ ADD THIS METHOD
    @action(detail=False, methods=["get"])
    def stats(self, request):
        user = request.user

        queryset = TaskModel.objects.filter(
            Q(assigned_to=user) | Q(project__created_by=user)
        )

        completed = queryset.filter(status="Done").count()
        in_progress = queryset.filter(status="In Progress").count()
        todo = queryset.filter(status="Todo").count()

        return Response({
            "completed": completed,
            "in_progress": in_progress,
            "todo": todo,
            "total": queryset.count()
        })
    
## Comment Model
class CommentViewset(viewsets.ModelViewSet):
    serializer_class = CommentSerializers
    permission_classes = [IsAuthenticated]
    
    
    ## Allowing only assigned users and project owner to see the comments 
    def get_queryset(self):
     user = self.request.user
     return CommentModel.objects.filter(task__assigned_to=user)|CommentModel.objects.filter(task__project__created_by=user)
    
    ## Only logged in user can do the comments none other than that  
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)