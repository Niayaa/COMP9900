from django.urls import path, include
from rest_framework import routers

from event_system_app import views
from event_system_app import view_test2
from event_system_app import view_test3

router = routers.DefaultRouter()

urlpatterns = [



    path('create_sample_data/', view_test2.create_test_data, name = 'create_sample_data'),#1
    path('create_sample_data3/', view_test3.create_test_data, name = 'create_sample_data'),#1


    path('mainpage/events/filter', views.MainPage.mainpage_filter_events, name='mainpage_filter_events'),#2


    path('cus/all/events/', views.CusAccountFunction.upcoming_and_past, name = 'upcoming_and_past'),#3


    path('cus/all_canceled/', views.CusAccountFunction.canceled_events, name = 'canceled_events'),#4


    path('cus/event/ticket/', views.CusAccountFunction.event_ticket, name = 'event_ticket'),#5


    path('cus/event_recommend/', views.CusAccountFunction.event_recommend, name = 'event_recommend'),#6





    path('send_reset_code/', views.LoginPage.send_reset_code, name='send_reset_code'), #7
    path('reset_password/', views.LoginPage.reset_password, name='reset_password'), #8
    path("register/", views.LoginPage.register, name="register"), #9
    path("login/", views.LoginPage.user_login, name="user_login"), #10


    path('cus/info/', views.AccountInfoPage.cus_info_show, name='cus_info_show'), #11

    path('org/info/', views.AccountInfoPage.org_info_show, name='org_info_show'), #12

    path('edit/cus/', views.AccountInfoPage.edit_cus_info, name='edit_cus_info'), #13
    path('edit/org/', views.AccountInfoPage.edit_org_info, name='edit_org_info'), #14


    path('event_create/', views.OrganizerFunctionPage.event_create, name='event_create'), #15
    path('edit_event/', views.OrganizerFunctionPage.edit_event, name = 'edit_event'), #16
    path('delete_event/', views.OrganizerFunctionPage.delete_event, name='delete_event'),#17
    path('created_events/', views.OrganizerFunctionPage.created_events, name = 'created_events'), #30
    path('org/event/ticket/', views.OrganizerFunctionPage.data_showing_check, name = 'data_showing_check'), #31

    path('booking/', views.PayAndCancel.payment, name = 'payment'), #18
    path('cus/cancel/event/', views.PayAndCancel.cancel_ticket, name = 'cancel_ticket'), #19

    path('payment/check_ticket_number/', views.PayAndCancel.cus_ticket_number_check, name='cus_ticket_stage_checking'), #29

    path('payment/process/', views.PayAndCancel.process_payment, name='process_payment'), #27

    path('payment/execute/', views.PayAndCancel.execute_payment, name='execute_payment'), #28




    path('event_page_detail/', views.EventDetailPage.get_event_detail, name = 'get_event_detail'), #20

    path('event_page_comment/', views.EventDetailPage.get_comment, name = 'get_comment'), #21

    path('submit_cus_comment/', views.EventDetailPage.cus_make_comment, name = 'cus_make _comment'), #22

    path('org_reply/', views.EventDetailPage.org_make_reply, name = 'org_make_reply'), #23

    path('like_Comment/', views.EventPage.like_Comment, name='like_Comment'),#24

    path('like_check/', views.EventPage.like_checking, name='like_check'),#25

    path('like_number/', views.EventPage.like_number_check, name='like_number_check'), #26


    path('get_cache/', views.LoginPage.get_cache_data, name='get_cache'), #26


    path('payment/check_ticket_number/', views.PayAndCancel.cus_ticket_number_check, name='cus_ticket_stage_checking'), #29




    path('get_event_number/', views.OrganizerReport.get_event_number, name='get_event_number'),


    path('get_event_types_summary/', views.OrganizerReport.get_event_types_summary, name='get_event_types_summary'),


    path('events_by_total_tickets_sold/', views.OrganizerReport.events_by_total_tickets_sold, name='events_by_total_tickets_sold'),


    path('events_by_total_revenue_and_type/', views.OrganizerReport.events_by_total_revenue_and_type, name='events_by_total_revenue_and_type'),


    path('events_by_completion_rate/', views.OrganizerReport.events_by_completion_rate, name='events_by_completion_rate'),


    path('events_by_total_sales/', views.OrganizerReport.events_by_total_sales, name='events_by_total_sales'),


    path('event_details_by_id/', views.OrganizerReport.event_details_by_id, name='event_details_by_id'),


    path('get_annual_ticket_sales/', views.OrganizerReport.get_annual_ticket_sales, name='get_annual_ticket_sales'),


    path('get_event_type_distribution/', views.OrganizerReport.get_event_type_distribution, name='get_event_type_distribution'),


    path('get_ticket_price_analysis/', views.OrganizerReport.get_ticket_price_analysis, name='get_ticket_price_analysis'),


    path('get_participation_analysis/', views.OrganizerReport.get_participation_analysis, name='get_participation_analysis'),


    path('get_customer_loyalty/', views.OrganizerReport.get_customer_loyalty, name='get_customer_loyalty'),


]