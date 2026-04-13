from django.urls import path
from .views import RegisterView, LogoutView, ProfileView, DashboardView, UserListView
 
# Each path connects a URL to a View.
# These URLs are prefixed with /api/v1/ in the main urls.py
 
urlpatterns = [
    # POST → creates a new user account (open to everyone)
    path("register/", RegisterView.as_view(), name="register"),
 
    # POST → blacklists the refresh token (logs the user out securely)
    path("logout/", LogoutView.as_view(), name="logout"),
 
    # GET → see your profile | PATCH → update your profile
    path("profile/", ProfileView.as_view(), name="profile"),
 
    # GET → returns dashboard summary: projects count, task counts, and role
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
 
    # GET → returns list of all users (id, username, role)
    # Used by owners to populate dropdowns for adding members / assigning tasks
    path("users/", UserListView.as_view(), name="user-list"),
]
 