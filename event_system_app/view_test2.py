from django.utils import timezone
from datetime import timedelta
from .models import *
from django.contrib.auth.hashers import make_password
import random
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse


@api_view(['GET'])
def create_test_data(request):
    # 创建两个 Customer 用户
    # print("come here 1")
    live_tags = ['rock', 'pop', 'electronic', 'jazz', 'acoustic', 'indie', 'folk', 'blues', 'country', 'reggae']
    concert_tags = ['magic', 'dance', 'circus', 'drama', 'puppetry', 'illusion', 'mime', 'ballet', 'greatest', 'theater']
    comedy_tags = ['standup', 'improv', 'satire', 'sketch', 'dark', 'parody', 'slapstick', 'absurdist', 'observational', 'situational']
    opera_tags = ['classic', 'modern', 'experimental', 'baroque', 'romantic', 'masterpiece', 'astonishing', 'modern', 'dreamlistic', 'english']

    all_tags = live_tags + concert_tags + comedy_tags + opera_tags

    if not Organizer.objects.exists():
        Organizer.objects.create( #第一个org账户
            org_email="org@qq.com",
            org_password=make_password("p123"),
            company_name="cc",
            company_address="cc",
            org_phone="111"
        ).save()
        # print("come here 2")
        Organizer.objects.create( #第二个org账户
            org_email="org@bbb.com",
            org_password=make_password("p123"),
            company_name="cc",
            company_address="cc",
            org_phone="111"
        ).save()
        # print("come here 3")
    # else:
    #     return HttpResponse("organizer is already exist")

    # 创建 Customer 样例数据
    if not Customer.objects.exists():
        Customer.objects.create( #第一个cus账户，设置随机tag为6个, 设置喜欢演出类型
            cus_name="11",
            cus_email="lzy2545322339@gmail.com",
            gender="Male",
            prefer_type="comedy",
            cus_password=make_password("p123"),
            bill_address="cc",
            cus_phone="111",
            account_balance = 0,
            prefer_tags = set(random.sample(all_tags, 6))
        ).save()
        # print("come here 4")
        Customer.objects.create( #第一个cus账户，设置随机tag为6个，不设置喜欢演出类型
            cus_name="11",
            cus_email="2545322339@qq.com",
            gender="Male",
            prefer_type="concert",
            cus_password=make_password("p123"),
            bill_address="cc",
            cus_phone="111",
            account_balance = 0,
            prefer_tags = set(random.sample(all_tags, 6))
        ).save()
        # print("come here 5")
        Customer.objects.create( #第3个cus账户，不设置tag，不设置喜欢演出类型
            cus_name="11",
            cus_email="11@qq.com",
            gender="Male",
            prefer_type="concert",
            cus_password=make_password("p123"),
            bill_address="cc",
            cus_phone="111",
            account_balance = 0,
            prefer_tags = set(random.sample(all_tags, 6))
        ).save()

    # 创建事件
    if not Event_info.objects.exists():
        organizer = Organizer.objects.all()  # 获取已创建的 Organizer 实例
        # print("come here 7")
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
        i = 0
        # print("come here 8")
        # 遍历并插入活动到数据库
        for event in events:
            event_instance = Event_info(
                event_name=event["event_name"],
                event_date=timezone.datetime.strptime(event["event_date"], "%Y-%m-%d"),
                event_description="This is an amazing event you don't want to miss!",
                event_address="123 Event Venue St, City, Country",
                event_image_url='static/event_default.jpg',
                event_type=event["event_type"],
                event_last_selling_date=timezone.datetime.strptime(event["event_date"], "%Y-%m-%d") - timezone.timedelta(
                    days=1),  # 售票截止日期假设为活动前1天
                event_tags = random.sample(all_tags, 5),
                organization=organizer[i % 2],  # 假设的组织者ID
            )
            event_instance.save()
            i += 1
            for ticket_type in ["A", "B", "C"]:
                ticket = Ticket_info(
                    event=event_instance,
                    ticket_type=ticket_type,
                    ticket_price=random.randint(50, 200),
                    ticket_amount=100,
                    ticket_remain=100
                    # reservation_time = event_date - timezone.timedelta(days=8)
                )
                ticket.save()
        # print("come here 10")
        # print(ticket)

        event_type = ['concert', 'live', 'comedy', 'opera']
        event_date = [-7, 0, 6, 25, 45]
        event_details = []
        for i in event_type:
            for j in event_date:
                tem_dict = {}
                tem_dict['days_from_now'] = j
                tem_dict['type'] = i
                event_details.append(tem_dict)
        # print("come here 11")

        i = 0
        for event_detail in event_details:
            event_date = (timezone.now() + timedelta(days=event_detail['days_from_now'])).replace(second=0,
                                                                                                  microsecond=0)
            last_selling_date = event_date - timedelta(days=10) if event_detail['days_from_now'] > 0 else (
                    timezone.now() - timedelta(days=17)).replace(second=0, microsecond=0)
            created_event = Event_info(
                event_name =f"Sample {event_detail['type']} Event",
                event_date = event_date,
                event_description=f"This is a {event_detail['type']} event.",
                event_address="1234 Event St.",
                event_image_url="static/default.jpg",  # 确保这个路径下有一个名为 default.jpg 的图片
                event_type=event_detail['type'],
                event_last_selling_date=last_selling_date,
                event_tags = random.sample(all_tags, 5),
                organization=organizer[i % 2]
            )
            created_event.save()

            no_tag_event = Event_info( #这个设置为没有tag的演出
                event_name ="No tag Event",
                event_date = (timezone.now() + timedelta(days=13)).replace(second=0,microsecond=0),                                                                             
                event_description=f"This is a great event.",
                event_address="1234 Event St.",
                event_image_url="static/default.jpg",  # 确保这个路径下有一个名为 default.jpg 的图片
                event_type='concert',
                event_last_selling_date = event_date - timedelta(days=1),
                event_tags = None,
                organization=organizer[i % 2]
            )

            no_tag_event.save()
            i += 1
            # print(event)
            for ticket_type in ["A", "B", "C"]:
                ticket = Ticket_info(
                    event=created_event,
                    ticket_type=ticket_type,
                    ticket_name = "Reserve for " + str(ticket_type),
                    ticket_price=random.randint(50, 200),
                    ticket_amount=100,
                    ticket_remain=100
                )
                ticket.save()
        # ticket = Ticket_info.objects.all()
        # print(ticket)
        # print("come here 11")

    # # else:
    # #     return HttpResponse("events is already exist")
    # ticket = Ticket_info.objects.all()
    # print(ticket)
    events = Event_info.objects.all()
    # print(events)
    customers = Customer.objects.all()
    # # print(customers)
    # # 两个customer都订购了每场演出的各类票各张
    for event in events:
        # print(event)
        tickets = Ticket_info.objects.filter(event=event).all()
        # print(a_type_ticket)
        for customer in customers:
            for ticket in tickets:
            # booking_amount = 
                total_booked_tickets = Reservation.objects.filter(event=event, ticket=ticket).count()
                row_number = total_booked_tickets // 20 + 1  # 确定排数，每排20个座位
                seat_number = total_booked_tickets % 20 + 1  # 确定在当前排的座位号
                seat_assignment = f"A-{row_number}-{seat_number}"
                reserve = Reservation(
                    customer=customer,
                    event=event,
                    ticket=ticket,
                    amount=random.randint(1, 5),
                    reservation_time = event.event_date - timezone.timedelta(days = 8),
                    reserve_seat = seat_assignment
                )
                reserve.save()

                if ticket.ticket_remain - reserve.amount > 0 :
                    ticket.ticket_remain -= reserve.amount
                    ticket.save()
    
    # 两个customer都在订购并且已结束超过一天的活动中，留下了评论，并给出了5分的评分，评论内容不能相同
    i = 0
    comment_customer = Customer.objects.filter(cus_id__in=[1, 2])
    for event in events:  # 假设前两个事件已结束
        if event.event_date < timezone.now():
            for customer in comment_customer:
                comment = Comment_cus(
                    event=event,
                    customer=customer,
                    event_rate=5,
                    comment_cus=f"Great event {i + 1}! - {customer.cus_name}",
                    comment_time=timezone.now().replace(second=0, microsecond=0)
                )
                comment.save()
                Reply_org(
                    event=event,
                    organization=event.organization,
                    reply_org="Thanks",
                    comment = comment,
                    reply_time=(timezone.now() + timedelta(minutes=1)).replace(second=0, microsecond=0)
                ).save()
        i += 1
    return HttpResponse("Sample events and reservations created successfully.", status = 200)
