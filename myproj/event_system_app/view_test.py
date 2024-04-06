from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
from .models import Organizer, Customer, Event_info, Reservation
from rest_framework.decorators import api_view

@api_view(['GET'])
def create_sample_data(request):
    # 创建 Organizer 样例数据
    if not Organizer.objects.exists():
        Organizer.objects.create(
            org_email="org@qq.com",
            org_password="p123",
            company_name="cc",
            company_address="cc",
            org_phone="111"
        )

    # 创建 Customer 样例数据
    if not Customer.objects.exists():
        Customer.objects.create(
            cus_name="11",
            cus_email="11@aaa.com",
            gender="Male",
            prefer_type="concert",
            cus_password="p123",
            bill_address="cc",
            cus_phone="111"
        )

    # 创建 Event_info 样例数据
    if not Event_info.objects.exists():
        organizer = Organizer.objects.first()  # 获取已创建的 Organizer 实例

        # 定义事件的时间和类型
        event_details = [
            {'days_from_now': 0, 'type': 'Concert'},
            {'days_from_now': 0, 'type': 'Art'},
            {'days_from_now': 6, 'type': 'Live'},
            {'days_from_now': 6, 'type': 'Opera'},
            {'days_from_now': 25, 'type': 'Concert'},
            {'days_from_now': 25, 'type': 'Art'},
            # 添加新的Opera类型的事件，时间在现在的7天前
            {'days_from_now': -7, 'type': 'Opera'},
            {'days_from_now': -7, 'type': 'Opera'},
        ]

        customer = Customer.objects.first()  # 获取已创建的 Customer 实例

        for event_detail in event_details:
            event_date = timezone.now() + timedelta(days=event_detail['days_from_now'])
            last_selling_date = event_date - timedelta(days=10) if event_detail['days_from_now'] > 0 else timezone.now() - timedelta(days=17)
            event = Event_info.objects.create(
                event_name=f"Sample {event_detail['type']} Event",
                event_date=event_date,
                event_description=f"This is a {event_detail['type']} event.",
                event_address="1234 Event St.",
                event_image="static/default.jpg",  # 确保这个路径下有一个名为 default.jpg 的图片
                event_type=event_detail['type'],
                ticket_amount=100,
                last_selling_date=last_selling_date,
                organization=organizer
            )

            # 为每个事件创建一条预订记录
            Reservation.objects.create(
                reservation_time=timezone.now(),
                customer=customer,
                event=event
            )

        print("success yeyeyeyeyey")
        return HttpResponse("Sample events and reservations created successfully.")
    else:
        return HttpResponse("Event_info records already exist.")
