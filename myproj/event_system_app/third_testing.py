# 导入Django设置环境变量，这一步骤通常在Django项目的某个初始化脚本中已经完成
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproj.settings')

# 导入Django，设置项目环境
import django
django.setup()

# # 导入Organizer模型，替换your_app_name为包含Organizer模型的应用名
from event_system_app.models import *

# # # 查询所有Organizer记录
all_organizers = Organizer.objects.all()

# print("aaaaa")
# print(all_organizers)
# print("bbbbb")
# # # 打印所有记录
for organizer in all_organizers:
    # 假设Organizer模型有字段如org_name和org_email，根据您的实际字段调整
    print(f'ID: {organizer.org_id}, Name: {organizer.company_name}, Email: {organizer.org_email}')

