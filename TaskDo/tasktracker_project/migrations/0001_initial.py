# Generated by Django 2.1.7 on 2019-04-28 13:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ProjectMember',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_in_team', models.BooleanField(default=False)),
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tasktracker_project.Project')),
            ],
        ),
        migrations.CreateModel(
            name='ProjectTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.PositiveIntegerField(default=0)),
                ('name', models.CharField(max_length=64)),
            ],
        ),
    ]