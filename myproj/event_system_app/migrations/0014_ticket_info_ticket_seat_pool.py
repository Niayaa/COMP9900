# Generated by Django 4.2.11 on 2024-04-11 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event_system_app', '0013_customer_prefer_tags_event_info_event_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticket_info',
            name='ticket_seat_pool',
            field=models.TextField(blank=True, default=''),
        ),
    ]