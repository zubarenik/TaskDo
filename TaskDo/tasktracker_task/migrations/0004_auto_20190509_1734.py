# Generated by Django 2.1.7 on 2019-05-09 17:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasktracker_task', '0003_auto_20190509_1425'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='close_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
