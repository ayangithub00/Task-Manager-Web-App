from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import ProjectModel
from .serializers import ProjectSerializers 
from rest_framework.decorators import action
from rest_framework.response import responses
from rest_framework.permissions import IsAuthenticated


# Create your views here.

class ProjectViewset(viewsets.ModelViewSet):
    queryset = ProjectModel.objects.all()
    serializer_class = ProjectSerializers
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user 
        return ProjectModel.objects.filter(members=user) | ProjectModel.objects.filter(created_by=user)
    
    def perform_create(self, serializer):
        project = serializer.save(created_by=self.request.user)
        project.members.set([self.request.user])
        

    
    