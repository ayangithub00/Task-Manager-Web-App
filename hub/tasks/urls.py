from django.urls import path , include
from .import views
from rest_framework.routers import DefaultRouter 

router = DefaultRouter()
router.register("tasks",views.TaskViewset,basename="tasks")
router.register("comments",views.CommentViewset, basename="comments")

urlpatterns = [
    
    
   path('', include(router.urls))

]
