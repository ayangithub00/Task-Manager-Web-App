from rest_framework import generics 
from .models import User
from projects.models import ProjectModel
from tasks.models import TaskModel
from .serializers import RegisterSerializer , ProfileSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import generics

# creating register view for registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
# This is for updating the user profile like email,password,bios
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    
## This is a logout view and here we have only post bcz we only send the reqst
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out successfully"})
    
## Dashboard viewset used to show users data 
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        data = {
            "username": user.username,
            "email": user.email,
            "total_projects": ProjectModel.objects.filter(created_by=user).count(),
            "assigned_tasks": TaskModel.objects.filter(assigned_to=user).count(),
            "completed_tasks": TaskModel.objects.filter(assigned_to=user, status="completed").count(),
            
        }

        return Response(data)