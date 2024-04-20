from django.apps import AppConfig
from django.db.models.signals import post_migrate

class EventSystemApp(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "event_system_app"

    def ready(self):
        from . import tasks

        post_migrate.connect(self.initiate_auto_comments, sender=self)

    def initiate_auto_comments(self, **kwargs):
        from . import tasks
        tasks.auto_create_comments()