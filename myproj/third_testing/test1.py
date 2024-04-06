import os
import django



# 设置环境变量指向你的settings.py文件
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproj.settings')

# 加载Django项目设置
django.setup()

# 现在可以安全地导入和使用Django模型了
from django.apps import apps
from event_system_app.models import *

all_entries = Customer.objects.all()

# print(all_entries.org_id)

for entry in all_entries:
    print(entry.cus_id)
