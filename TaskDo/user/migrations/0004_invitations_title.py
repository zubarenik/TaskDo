# Generated by Django 2.1.7 on 2019-05-22 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20190509_1427'),
    ]

    operations = [
        migrations.AddField(
            model_name='invitations',
            name='title',
            field=models.CharField(max_length=256, null=True),
        ),
    ]