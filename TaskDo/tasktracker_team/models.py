from django.db import models
from user.models import CustomUser


class Team(models.Model):
    name = models.CharField(max_length=256)
    type = models.BooleanField(default=False)
    description = models.TextField()
    rating = models.PositiveIntegerField(null=True, blank=True)


class TeamMember(models.Model):
    member = models.ForeignKey(CustomUser, on_delete=None)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    role = models.CharField(max_length=256, null=True)


class TeamNews(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    author = models.ForeignKey(TeamMember, on_delete=None)
    title = models.CharField(max_length=256)
    description = models.TextField()
    creation_data = models.DateTimeField()
