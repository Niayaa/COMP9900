# Generated by Django 4.2.11 on 2024-04-12 02:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event_system_app', '0014_ticket_info_ticket_seat_pool'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='age_area',
            field=models.CharField(choices=[('18-25', '18-25 Years'), ('26-35', '26-35 Years'), ('36-45', '36-45 Years'), ('46-55', '46-55 Years'), ('56-65', '56-65 Years'), ('65+', '65+ Years')], max_length=20, null=True),
        ),
    ]
