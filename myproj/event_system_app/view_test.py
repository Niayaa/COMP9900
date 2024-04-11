from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
from .models import *
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password, check_password

@api_view(['GET'])
def create_sample_data(request):
    # 创建 Organizer 样例数据
    if not Organizer.objects.exists():
        Organizer.objects.create(
            org_email="org@qq.com",
            org_password=make_password("p123"),
            company_name="cc",
            company_address="cc",
            org_phone="111"
        ).save()
        
        Organizer.objects.create(
            org_email="org@bbb.com",
            org_password = make_password("p123"),
            company_name="cc",
            company_address="cc",
            org_phone="111"
        ).save()

    # 创建 Customer 样例数据
    if not Customer.objects.exists():
        Customer.objects.create(
            cus_name="11",
            cus_email="lzy2545322339@gmail.com",
            gender="Male",
            prefer_type="concert",
            cus_password=make_password("p123"),
            bill_address="cc",
            cus_phone="111"
        ).save()



    # 创建 Event_info 样例数据
    if not Event_info.objects.exists():
        organizer = Organizer.objects.first()  # 获取已创建的 Organizer 实例

        events = [
            {
                "event_name": "TAYLOR SWIFT | THE ERAS TOUR",
                "event_date": "2024-03-07",
                "event_type": "concert",
            },
            {
                "event_name": "ED SHEERAN | + - = ÷ x TOUR",
                "event_date": "2024-04-10",
                "event_type": "live",
            },
            {
                "event_name": "BILLIE EILISH | HAPPIER THAN EVER TOUR",
                "event_date": "2024-05-15",
                "event_type": "concert",
            },
            {
                "event_name": "OPERA EVENT",
                "event_date": "2024-05-20",
                "event_type": "concert",
            },
        ]

        # 遍历并插入活动到数据库
        for event in events:
            event_instance = Event_info(
                event_name=event["event_name"],
                event_date=timezone.datetime.strptime(event["event_date"], "%Y-%m-%d"),
                event_description="This is an amazing event you don't want to miss!",
                event_address="123 Event Venue St, City, Country",
                event_image='static/event_default.jpg',
                event_type=event["event_type"],
                ticket_amount=100,  # 假设的票数
                last_selling_date=timezone.datetime.strptime(event["event_date"], "%Y-%m-%d") - timezone.timedelta(
                    days=30),  # 售票截止日期假设为活动前30天
                organization=organizer,  # 假设的组织者ID
            )
            event_instance.save()

        # 定义事件的时间和类型
        event_type = ['concert', 'live', 'comedy', 'opera']
        event_date = [-7, 0, 6, 25, 45]
        event_details = []
        for i in event_type:
            for j in event_date:
                tem_dict = {}
                tem_dict['days_from_now'] = j
                tem_dict['type'] = i
                event_details.append(tem_dict)

        customer = Customer.objects.first()  # 获取已创建的 Customer 实例
        ticket_class = []

        for event_detail in event_details:
            event_date = (timezone.now() + timedelta(days=event_detail['days_from_now'])).replace(second=0,
                                                                                                  microsecond=0)
            last_selling_date = event_date - timedelta(days=10) if event_detail['days_from_now'] > 0 else (
                        timezone.now() - timedelta(days=17)).replace(second=0, microsecond=0)
            event = Event_info.objects.create(
                event_name=f"Sample {event_detail['type']} Event",
                event_date=event_date,
                event_description=f"This is a {event_detail['type']} event.",
                event_address="1234 Event St.",
                event_image_url=None,  # 确保这个路径下有一个名为 default.jpg 的图片
                event_type=event_detail['type'],
                last_selling_date=last_selling_date,
                organization=organizer
            )

            # 为每个事件创建一条预订记录
            Reservation.objects.create(
                reservation_time=timezone.now().replace(second=0, microsecond=0),
                customer=customer,
                event=event
            )

        print("success yeyeyeyeyey")
        return HttpResponse("Sample events and reservations created successfully.")
    else:
        return HttpResponse("Event_info records already exist.")
