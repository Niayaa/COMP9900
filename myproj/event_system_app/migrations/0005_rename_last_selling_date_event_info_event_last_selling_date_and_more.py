# Generated by Django 4.2.11 on 2024-04-06 01:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event_system_app', '0004_ticket_info_ticket_remain'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event_info',
            old_name='last_selling_date',
            new_name='event_last_selling_date',
        ),
        migrations.RemoveField(
            model_name='event_info',
            name='event_image',
        ),
        migrations.AddField(
            model_name='event_info',
            name='event_image_url',
            field=models.TextField(null=True),
        ),
    ]
