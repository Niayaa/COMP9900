from django.utils import timezone
from datetime import timedelta
from .models import *


def auto_create_comments():

    target_date = timezone.now() - timedelta(days=7)

    events = Event_info.objects.filter(event_date__lt=target_date)
    for event in events:

        reservations = Reservation.objects.filter(event=event)
        for reservation in reservations:
            customer = reservation.customer

            if not Comment_cus.objects.filter(event=event, customer=customer).exists():

                Comment_cus.objects.create(
                    event=event,
                    customer=customer,
                    event_rate=5,
                    comment_cus="wonderful",
                    comment_time=timezone.now()
                )
    print("Auto comment creation task completed.")