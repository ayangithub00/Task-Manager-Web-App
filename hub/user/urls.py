from django.urls import path
from .views import RegisterView , LogoutView , ProfileView , DashboardView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]