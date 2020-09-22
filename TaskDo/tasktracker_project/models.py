from django.db import models
from user.models import CustomUser
from tasktracker_team.models import Team


class ProjectTag(models.Model):
    type = models.PositiveIntegerField(default=0)
    name = models.CharField(max_length=64)


class Project(models.Model):
    owner_id = models.ForeignKey(CustomUser, on_delete=None)
    title = models.CharField(max_length=40)
    description = models.TextField()
    tags = models.ManyToManyField(ProjectTag, blank=True)


class ProjectMember(models.Model):
    user_id = models.ForeignKey(CustomUser, on_delete=None)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    is_in_team = models.BooleanField(default=False)
    team_id = models.ForeignKey(Team, on_delete=None, null=True, blank=True)
    role = models.CharField(max_length=256, null=True)


class ProjectTeamMembership(models.Model):
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE)
    project_flag = models.ForeignKey(Project, on_delete=models.CASCADE)
