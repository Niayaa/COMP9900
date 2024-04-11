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

4
class Customer(models.Model):
    # 修改成设计为 firstname 和 lastname 两种
    cus_id = models.AutoField(primary_key = True)
    cus_name =  models.TextField(max_length = 50, null = False)
    cus_email = models.TextField(max_length = 255, null = False)
    gender = models.CharField(max_length = 20, choices=[('Male', 'Male'), ('Female', 'Female')], null = True)
    prefer_type = models.CharField(max_length = 20,
                                   choices = [('live', 'live'),('concert', 'concert'),
                                              ('opera','opera'), ('show', 'show')], null = True)

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
    # 注意一下，static文件夹好像还没有设置过
    event_type = models.CharField(max_length = 20, choices = [('Concert', 'Concert'), ('live','live'), ('opera', 'opera')])
    event_last_selling_date = models.DateTimeField(blank = False, null = False)
    organization = models.ForeignKey(Organizer, on_delete = models.SET_NULL, null=True)

    class Meta:
        db_table = 'Event_info'
    
    def __str__(self):
        return str(self.event_id)
    
    def delete(self, using=None, keep_parents=False):
        with transaction.atomic():
            # 获取所有相关的Reservation记录
            reservations = Reservation.objects.select_related('ticket').filter(event=self)

            # 为每个订票退款
            for reservation in reservations:
                # 假设我们有一个User模型，并且Reservation模型有一个user字段以及一个ticket_price字段
                customer = reservation.customer
                ticket_price = reservation.ticket.ticket_price
                customer.account_balance += ticket_price  # 退还票价到用户余额
                customer.save()

            # 删除所有Reservation记录
            reservations.delete()

            # 调用父类的delete方法来删除事件本身
            super().delete(using=using, keep_parents=keep_parents)


class Ticket_info(models.Model):
    ticket_id = models.AutoField(primary_key = True)
    ticket_type = models.TextField(null = False)
    ticket_name = models.TextField(null = False, blank = True, default = "Special reserving area")
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
    reservation_time = models.DateTimeField(blank = True, null = False) #演出订购时间
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
    cancel_time = models.DateTimeField(blank = False, null = False) #取消时间
    cancel_amount = models.IntegerField(blank = False, null = False, default = 0) #取消的数量,并设置初始化为0
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
    comment_cus = models.TextField(max_length = 500, null = False) # 这个的意思是comment的内容
    comment_time = models.DateTimeField(null = False) #消费者留下评论的时间
    comment_image_url = models.TextField(null = True, blank = True, default = None) #消费者留下评论图片的url
    # comment_like = models.IntegerField(null = False, blank = True, default = 0)
    event = models.ForeignKey(Event_info, on_delete = models.SET_NULL, null = True)
    customer = models.ForeignKey(Customer, on_delete = models.SET_NULL, null = True)


    def __str__(self):
        # 可能不该返回comment_id
        return str(self.comment_id)
    class Meta:
        db_table = 'Comment_cus'

class Reply_org(models.Model):
    reply_id = models.AutoField(primary_key = True)
    reply_org = models.TextField() # 这个的意思是reply的内容
    reply_time = models.DateTimeField()
    event = models.ForeignKey(Event_info, on_delete = models.CASCADE, null = True)
    organization = models.ForeignKey(Organizer, on_delete = models.CASCADE, null = True)
    comment = models.ForeignKey(Comment_cus, on_delete = models.SET_NULL, related_name='replies', null = True)

    class Meta:
        db_table = 'Reply_org'
    
    def __str__(self):
        # 可能不该返回reply_id
        return str(self.reply_id)