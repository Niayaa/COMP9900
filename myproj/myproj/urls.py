"""
URL configuration for myproj project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework import routers

from event_system_app import views
from event_system_app import view_test

router = routers.DefaultRouter()

urlpatterns = [
    # #创建测试数据
    path('create_sample_data/', view_test.create_sample_data, name = 'create_sample_data'),

    path('mainpage/events/filter', views.mainpage_filter_events, name='mainpage_filter_events'),
    # 测试端口
    path('tesing_code/', views.testing_port, name='testing_port'),

    # #给用户推荐活动
    path('api/events_grouped/', views.get_events_grouped_by_type, name = 'events_grouped_by_type'),
    path('api/user/<int:user_id>/preferred-events/', views.get_user_preferred_events, name='user_preferred_events'),
    path('api/events/', views.get_all_events, name='all_events'),

    # #用户订购过的演出查看功能
    #订购了即将开始的活动
    path('api/upcoming_events/<int:user_id>/', views.get_upcoming_reservations, name='upcoming_events'),
    path('api/past_events/<int:user_id>/', views.get_past_reservations, name='past_events'),

    #注册和登录功能
    path("register/", views.register, name="register"),  # 注册功能
    path("login/", views.user_login, name="user_login"),  # 登录功能

    # 展示所有演出的功能
    path('events/', views.EventListView.as_view(), name='event_list'),  # 展示所有演出的功能

    # 找回密码的功能
    path('send_reset_code/', views.send_reset_code, name='send_reset_code'),
    path('reset_password/', views.reset_password, name='reset_password'),


    # 当进入登录后进入用户界面
    path('cus/<int:user_id>', views.cus_info_show, name='cus_info_show'),  # 进入用户界面
    path('org/<int:user_id>', views.org_info_show, name='org_info_show'),  # 进入组织者界面

    # 个人界面上的信息修改功能
    path('edit/cus/', views.edit_cus_info, name='edit_cus_info'),
    path('edit/org/', views.edit_org_info, name='edit_org_info'),
]