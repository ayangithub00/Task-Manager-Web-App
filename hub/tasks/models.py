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

    # FIX: related_name was "project" which collides with Django's internal
    # reverse accessor when cascading deletes — causing 500 on project delete.
    # Changed to "tasks" so you can do project_instance.tasks.all() cleanly.
    project = models.ForeignKey(
        ProjectModel,
        on_delete=models.CASCADE,
        related_name="tasks"   # was "project" — that caused the 500 on DELETE
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assigned_tasks"  # was "assigned_to" — also a collision risk
    )

    status = models.CharField(max_length=50, choices=STATUS_CHOICE)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    due_date = models.DateField()
    created_at = models.DateField()

    # Stores the date when this task was marked as Done.
    # Used by the dashboard weekly activity chart.
    completed_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title


class CommentModel(models.Model):
    # FIX: related_name was "task" — changed to "comments" to avoid collision
    task = models.ForeignKey(
        TaskModel,
        on_delete=models.CASCADE,
        related_name="comments"  # was "task"
    )

    # FIX: related_name was "user" — changed to "comments" scoped to avoid collision
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="task_comments"  # was "user"
    )

    content = models.CharField(max_length=100)
    created_at = models.DateField()