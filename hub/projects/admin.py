
# Register your models here.

from django.contrib import admin
from .models import ProjectModel


@admin.register(ProjectModel)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "created_by")
    filter_horizontal = ("members",)