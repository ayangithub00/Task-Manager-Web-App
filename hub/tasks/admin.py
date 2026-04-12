from django.contrib import admin
from .models import TaskModel , CommentModel
# Register your models here.

from django.contrib import admin



@admin.register(TaskModel)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "assigned_to", "status")
    list_filter = ("status", "project")
    
@admin.register(CommentModel)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("task","content")
    # list_filter = ("task")