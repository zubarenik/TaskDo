# Generated by Django 2.1.7 on 2019-04-28 13:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasktracker_task', '0001_initial'),
        ('tasktracker_project', '0003_auto_20190428_1336'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='owner_id',
            field=models.ForeignKey(on_delete=None, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='task',
            name='project_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tasktracker_project.Project'),
        ),
    ]
