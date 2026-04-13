from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# When a ViewSet uses get_queryset() dynamically instead of a static
# queryset = Model.objects.all() class attribute, Django REST Framework
# cannot automatically figure out the basename for URL naming.
# We must provide it manually with basename="project".
# This generates URL names like: "project-list", "project-detail", "project-members"
router.register("project", views.ProjectViewset, basename="project")

urlpatterns = [
    path('', include(router.urls))
]