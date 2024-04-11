from django.urls import path, include
from rest_framework import routers

from event_system_app import views
from event_system_app import view_test, view_test2

router = routers.DefaultRouter()

urlpatterns = [
    # 进入主界面自动运行功能
    #

    # #创建测试数据
    path('create_sample_data/', view_test2.create_test_data, name = 'create_sample_data'),#1



    # Mainpage的功能
    # '''测试通过，搜索框功能还没编写''',
    #       1)按照演出种类和时间来进行筛选                
    #       2)搜索框搜索功能
    path('mainpage/events/filter', views.MainPage.mainpage_filter_events, name='mainpage_filter_events'),#2


    # customer_order_page 给用户推荐活动的界面
    #   测试完成
    #       1)upcoming and past
    #       2)用户取消过的演出
    #       3)用户查看演出票详细信息
    #       4)推荐算法
    path('cus/all/events/', views.CusAccountFunction.upcoming_and_past, name = 'upcoming_and_past'),#3
    # url的设计方式为 http://127.0.0.1:8000/cus/all/events/?user_id=1

    path('cus/all_canceled/', views.CusAccountFunction.canceled_events, name = 'canceled_events'),#4
    # url的设计方式为 http://127.0.0.1:8000/cus/all_canceled/?user_id=1


    # '''
    # Nicole 需要的第二个功能，下面的这个event_ticket
    # '''


    path('cus/event/ticket/', views.CusAccountFunction.event_ticket, name = 'event_ticket'),#5
    # url的设计方式为 http://127.0.0.1:8000/cus/event/ticket/?user_id=1&event_id=3

    path('cus/event_recommend/', views.CusAccountFunction.event_recommend, name = 'event_recommend'),#6
    # url的设计方式为 http://127.0.0.1:8000/cusevent_recommend/?user_id=1



    # loginpage 和 signUppage 的功能:
    #   测试完成
    #       1)注册功能
    #       2)登录功能
    #       3)发送验证码功能
    #       4)提交保存修改密码
    path('send_reset_code/', views.LoginPage.send_reset_code, name='send_reset_code'), #7
    path('reset_password/', views.LoginPage.reset_password, name='reset_password'), #8
    path("register/", views.LoginPage.register, name="register"), #9
    path("login/", views.LoginPage.user_login, name="user_login"), #10


    # CustomerAccountPage.js 和 OrganizerAccountPage.js
    # 测试完成
    #       1)向页面反馈当前登录的消费者的个人信息
    #       2)向页面反馈当前登录的组织者的个人信息
    #       3)消费者修改并保存个人信息
    #       4)组织者修改并保存个人信息
    path('cus/<int:user_id>', views.AccountInfoPage.cus_info_show, name='cus_info_show'), #11
    path('org/<int:user_id>', views.AccountInfoPage.org_info_show, name='org_info_show'), #12
    path('edit/cus/', views.AccountInfoPage.edit_cus_info, name='edit_cus_info'), #13
    path('edit/org/', views.AccountInfoPage.edit_org_info, name='edit_org_info'), #14


    # Create Event And Cancel Page
    #     测试完成
    #       1)创建演出
    #       2)修改演出
    #       3)删除演出
    path('event_create/', views.OrganizerFunctionPage.event_create, name='event_create'), #15
    path('edit_event/', views.OrganizerFunctionPage.edit_event, name = 'edit_event'), #16
    path('delete_event/', views.OrganizerFunctionPage.delete_event, name='delete_event'),#17


    # PayAndCancel（针对用户来说）
    #   测试完成
    #       1)订票功能
    #       2)取消预订功能
    path('booking/', views.PayAndCancel.payment, name = 'payment'), #18
    #     传入url的时候要按照这样传入 http://127.0.0.1:8000/booking/?email=2545322339@qq.com&event_id=1
    path('cus/cancel/event/', views.PayAndCancel.cancel_ticket, name = 'cancel_ticket'), #19
    #     传入url的时候要按照这样传入 http://127.0.0.1:8000/customer_cancel/?amount=1&reservation_id=1


    # Event Info page
    #   测试完成
    #   1)展示演出的详细信息
    #   2)展示评论信息和回复信息
    #   3)评论功能
    #   4)组织者回复功能
    path('event_page_detail/', views.EventDetailPage.get_event_detail, name = 'get_event_detail'), #20
    path('event_page_comment/', views.EventDetailPage.get_comment, name = 'get_comment'), #21
    # 传入url的时候要按照这样传入 http://127.0.0.1:8000/event_page_comment/?event_id=1
    path('submit_cus_comment/', views.EventDetailPage.cus_make_comment, name = 'cus_make _comment'), #22
    # 传入url的时候要按照这样传入 http://127.0.0.1:8000/submit_cus_comment/?event_id=1&cus_id=1
    path('org_reply/', views.EventDetailPage.org_make_reply, name = 'org_make_reply'), #23
    # 传入url的时候要按照这样传入 http://127.0.0.1:8000/submit_cus_comment/?user_id=1&comment_id=1

    # Organzier function
    #   测试完成
    #   1)获取所有创建过的演出
    #   2)获取报告功能
    path('created_events/', views.OrganizerFunctionPage.created_events, name = 'created_events'), #24
    path('org/event/ticket/', views.OrganizerFunctionPage.data_showing_check, name = 'data_showing_check'), #25
    
]