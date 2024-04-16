# Generated by Django 5.0.3 on 2024-04-15 13:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("event_system_app", "0016_alter_likecheck_unique_together"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customer",
            name="age_area",
            field=models.CharField(
                choices=[
                    ("0-18", "0-18 Years"),
                    ("19-40", "19-40 Years"),
                    ("41-60", "41-60 Years"),
                    ("61-100", "61-100 Years"),
                ],
                max_length=20,
                null=True,
            ),
        ),
        migrations.AlterUniqueTogether(
            name="likecheck",
            unique_together={("customer", "comment")},
        ),
    ]