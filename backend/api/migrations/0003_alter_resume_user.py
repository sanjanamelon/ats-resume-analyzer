# Generated by Django 5.2 on 2025-04-29 17:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_analysisresult_feedback_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resume',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='resumes', to='api.user'),
        ),
    ]
