from django.db import models
from django.conf import settings
from projects.models import ProjectModel


class TaskModel(models.Model):

    STATUS_CHOICE = (
        ("Todo", "Todo"),
        ("In Progress", "In Progress"),
        ("Done", "Done"),
    )

    PRIORITY_CHOICES = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    )

    title = models.CharField(max_length=50)
    description = models.CharField(max_length=1000)

    
    project = models.ForeignKey(
        ProjectModel,
        on_delete=models.CASCADE,
        related_name="tasks"   
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assigned_tasks"  
    )

    status = models.CharField(max_length=50, choices=STATUS_CHOICE)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    due_date = models.DateField()
    created_at = models.DateField()

    
    completed_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title


class CommentModel(models.Model):
   
    task = models.ForeignKey(
        TaskModel,
        on_delete=models.CASCADE,
        related_name="comments"  
    )

    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="task_comments"  
    )

    content = models.CharField(max_length=100)
    created_at = models.DateField()
