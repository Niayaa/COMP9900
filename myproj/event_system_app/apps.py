from django.apps import AppConfig
from django.db.models.signals import post_migrate

class EventSystemApp(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "event_system_app"

    def ready(self):
        from . import tasks  # 导入模型防止循环引用
        # 连接到post_migrate信号，确保在数据库准备好后执行
        post_migrate.connect(self.initiate_auto_comments, sender=self)

    def initiate_auto_comments(self, **kwargs):
        from . import tasks  # 导入模型防止循环引用
        tasks.auto_create_comments()