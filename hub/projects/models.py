from django.db import models
from user.models import User
from django.conf import settings

# Create your models here.

class ProjectModel(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=1000)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="created_projects")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL,related_name="member_projects")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name