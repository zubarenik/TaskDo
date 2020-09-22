from django.db import models
from user.models import CustomUser
from tasktracker_project.models import Project


class Task(models.Model):
    owner_id = models.ForeignKey(CustomUser, on_delete=None)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    description = models.TextField()
    assignee = models.CharField(max_length=250, null=True)
    entry_date = models.DateField(null=True)
    close_date = models.DateField(null=True, blank=True)
