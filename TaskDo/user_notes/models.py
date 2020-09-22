from django.db import models


class Notes(models.Model):
    user_id = models.ForeignKey('user.CustomUser', on_delete=models.CASCADE)
    title = models.CharField(max_length=256)
    text = models.TextField()
    priority = models.IntegerField(null=True)
    date = models.DateField(null=True, blank=True)
    time = models.TimeField(null=True, blank=True)
