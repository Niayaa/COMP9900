from django.db import models
from django.db import transaction


class Organizer(models.Model):
    org_id = models.AutoField(primary_key = True)
    org_email = models.TextField(max_length = 255, null = False)
    org_password = models.TextField(null = False)
    company_name = models.TextField(max_length = 255, null = False)
    company_address = models.TextField(max_length = 255, null = False)
    org_phone = models.CharField(max_length = 10, null = False)

    class Meta:
        db_table = 'Organizer'
    
    def __str__(self):
        return str(self.org_id)


class Customer(models.Model):

    cus_id = models.AutoField(primary_key = True)
    cus_name = models.TextField(max_length = 50, null = False)
    cus_email = models.TextField(max_length = 255, null = False)
    gender = models.TextField(max_length = 20,  null = True)
    prefer_type = models.TextField(max_length = 20,null = True)


    age_area = models.TextField(max_length = 20, null = True)

    prefer_tags = models.TextField(blank=True, null = True)
    cus_password = models.TextField(null = False)
    bill_address = models.TextField(max_length = 255, null = False)
    cus_phone = models.TextField(null = False)
    account_balance = models.DecimalField(max_digits = 500, decimal_places = 2, null = False, blank = True, default = 0)

    class Meta:
        db_table = 'Customer'
    
    def __str__(self):
        return str(self.cus_id)


class Event_info(models.Model):
    event_id = models.AutoField(primary_key = True)
    event_name = models.TextField(max_length = 50, null = False)
    event_date = models.DateTimeField(blank = False, null = False)
    event_description = models.TextField(max_length = 5000, null = False)
    event_address = models.TextField(max_length = 50, null = False)
    event_tags = models.TextField(blank=True, null=True)

    event_image_url = models.TextField(null = True)

    event_type = models.CharField(max_length = 20, choices = [('Concert', 'Concert'), ('live','live'), ('opera', 'opera')])
    event_last_selling_date = models.DateTimeField(blank = False, null = False)
    # likes = models.IntegerField(default=0, help_text="Number of likes for the event")
    organization = models.ForeignKey(Organizer, on_delete = models.SET_NULL, null=True)

    class Meta:
        db_table = 'Event_info'
    
    def __str__(self):
        return str(self.event_id)
    
    def delete(self, using=None, keep_parents=False):
        with transaction.atomic():

            reservations = Reservation.objects.select_related('ticket').filter(event=self)

            for reservation in reservations:

                customer = reservation.customer
                ticket_price = reservation.ticket.ticket_price
                customer.account_balance += ticket_price
                customer.save()


            reservations.delete()


            super().delete(using=using, keep_parents=keep_parents)


class Ticket_info(models.Model):
    ticket_id = models.AutoField(primary_key = True)
    ticket_type = models.TextField(null = False)
    ticket_name = models.TextField(null = False, blank = True, default = "Special reserving area")
    ticket_seat_pool = models.TextField(null = False, blank = True, default = '')
    ticket_amount = models.IntegerField(null = False)
    ticket_price = models.IntegerField(null = False)
    ticket_remain = models.IntegerField(null = False, default = 0)
    event = models.ForeignKey(Event_info,on_delete = models.SET_NULL, null = True)

    def __str__(self):
        return str(self.ticket_id)

    class Meta:
        db_table = 'Ticket_info'

class Reservation(models.Model):
    reservation_id = models.AutoField(primary_key = True)
    reservation_time = models.DateTimeField(blank = True, null = False)
    amount = models.IntegerField(blank = True, null = False, default = 0)
    reserve_seat = models.TextField(blank = True, null = False)

    event = models.ForeignKey(Event_info, on_delete = models.SET_NULL, null = True)
    ticket = models.ForeignKey(Ticket_info, on_delete = models.SET_NULL, null = True)
    customer = models.ForeignKey(Customer, on_delete = models.SET_NULL, null = True)

    def __str__(self):
        return str(self.reservation_id)

    class Meta:
        db_table = 'Reservation'

class Cancel(models.Model):
    cancel_id = models.AutoField(primary_key = True)
    cancel_time = models.DateTimeField(blank = False, null = False)
    cancel_amount = models.IntegerField(blank = False, null = False, default = 0)
    event = models.ForeignKey(Event_info, on_delete = models.SET_NULL, null = True)
    ticket = models.ForeignKey(Ticket_info, on_delete = models.SET_NULL, null = True)
    customer = models.ForeignKey(Customer, on_delete = models.SET_NULL, null = True)

    def __str__(self):
        return str(self.cancel_id)

    class Meta:
        db_table = 'Cancel'



class Comment_cus(models.Model):
    comment_id = models.AutoField(primary_key = True)
    event_rate = models.IntegerField(null = True)
    comment_cus = models.TextField(max_length = 500, null = False)
    comment_time = models.DateTimeField(null = False)
    comment_image_url = models.TextField(null = True, blank = True, default = None)
    likes = models.IntegerField(default=0, help_text="Number of likes for the event")
    event = models.ForeignKey(Event_info, on_delete = models.SET_NULL, null = True)
    customer = models.ForeignKey(Customer, on_delete = models.SET_NULL, null = True)

    def __str__(self):

        return str(self.comment_id)
    class Meta:
        db_table = 'Comment_cus'

class Reply_org(models.Model):
    reply_id = models.AutoField(primary_key = True)
    reply_org = models.TextField()
    reply_time = models.DateTimeField()
    event = models.ForeignKey(Event_info, on_delete = models.CASCADE, null = True)
    organization = models.ForeignKey(Organizer, on_delete = models.CASCADE, null = True)
    comment = models.ForeignKey(Comment_cus, on_delete = models.SET_NULL, related_name='replies', null = True)

    class Meta:
        db_table = 'Reply_org'
    
    def __str__(self):

        return str(self.reply_id)

class LikeCheck(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment_cus, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Like'

    def __str__(self):
        return f"{self.customer.cus_id} likes {self.comment.comment_id}"

