from django.utils import timezone
from datetime import timedelta
from .models import *


def auto_create_comments():
    # 计算日期：今天减去7天
    target_date = timezone.now() - timedelta(days=7)
    # 找出已经结束超过7天的演出
    events = Event_info.objects.filter(event_date__lt=target_date)
    for event in events:
        # 对于每个演出，找出所有预订了但没有留下评论的观众
        reservations = Reservation.objects.filter(event=event)
        for reservation in reservations:
            customer = reservation.customer
            # 检查这个观众是否已经对该演出留下了评论
            if not Comment_cus.objects.filter(event=event, customer=customer).exists():
                # 为他们自动留下评论
                Comment_cus.objects.create(
                    event=event,
                    customer=customer,
                    event_rate=5,
                    comment_cus="wonderful",
                    comment_time=timezone.now()
                )
    print("Auto comment creation task completed.")