# Generated by Django 2.1.7 on 2019-05-11 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_notes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='notes',
            name='time',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
