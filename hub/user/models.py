from django.db import models
from django.contrib.auth.models import AbstractUser
 
 
# We extend Django's built-in User model using AbstractUser.
# This gives us all default fields (username, email, password, etc.)
# and lets us ADD our own custom fields on top.
 
class User(AbstractUser):
 
    # These are the two roles a user can have in this system.
    # 'owner' = someone who creates and manages projects
    # 'member' = someone who gets added to projects and works on tasks
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('member', 'Member'),
    )
 
    # role field: stores whether this user is an owner or a member.
    # Default is 'member' so if someone registers without picking, they're a member.
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
 
    # bio field: optional extra info about the user (shown on profile page).
    bio = models.TextField(blank=True, null=True)
 
    def __str__(self):
        # This controls what shows up when you print a User object.
        # e.g. in Django admin or in shell it'll show "john (owner)"
        return f"{self.username} ({self.role})"