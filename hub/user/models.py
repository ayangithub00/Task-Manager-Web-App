from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    bio = models.TextField(blank=True, null=True)