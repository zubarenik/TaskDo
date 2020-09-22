# Generated by Django 2.1.7 on 2019-05-19 13:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasktracker_team', '0002_auto_20190428_1336'),
    ]

    operations = [
        migrations.CreateModel(
            name='TeamNews',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField()),
                ('creation_data', models.DateTimeField()),
                ('author', models.ForeignKey(on_delete=None, to='tasktracker_team.TeamMember')),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tasktracker_team.Team')),
            ],
        ),
    ]