from django.urls import path
from . import views

app_name = 'event_system_app'

# urlpatterns = [
#
#     # 创建测试数据
#     path('create_sample_data/', views.create_sample_data, name='create_sample_data'),
#
#     # 测试端口
#     path('tesing_code/', views.testing_port, name='testing_port'),
#
#     path("register/", views.register, name = "register"), # 注册功能
#     path("login/", views.user_login, name = "user_login"), # 登录功能
#     path('events/', views.EventListView.as_view(), name = 'event-list'), #展示所有演出的功能
#
#     # 找回密码的功能
#     path('send_reset_code/', views.send_reset_code, name = 'send_reset_code'),
#     path('reset_password/', views.reset_password, name = 'reset_password'),
#
#     #当进入登录后进入用户界面
#
#     # 不能用data，要修改成接收传入参数的方式
#     path('cus/data', views.cus_info_show, name = 'cus_info_show'), # 进入用户界面
#     # path('org/data', views.org_info_show, name = 'org_info_show'), # 进入组织者界面
#
#     # 个人界面上的信息修改功能
#     path('edit/cus/', views.edit_cus_info, name = 'edit_cus_info'),
#     path('edit/org/', views.edit_org_info, name = 'edit_org_info'),
# ]