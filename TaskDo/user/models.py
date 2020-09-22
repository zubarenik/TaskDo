from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.BooleanField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    projects_amount = models.PositiveIntegerField(null=True, blank=True)
    avatar = models.ImageField(upload_to='images', blank=True)


from tasktracker_project.models import Project
from tasktracker_team.models import Team


class Invitations(models.Model):
    title = models.CharField(max_length=256, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()
    inviter_id = models.IntegerField(null=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, default=None, null=True)
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE, default=None, null=True)
    role = models.CharField(max_length=256)
    is_read = models.BooleanField(null=True)
