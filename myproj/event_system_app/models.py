from django.db import models


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
        return self.org_id


class Customer(models.Model):
    # 修改成设计为 firstname 和 lastname 两种
    cus_id = models.AutoField(primary_key = True)
    cus_name =  models.TextField(max_length = 50, null = False)
    cus_email = models.TextField(max_length = 255, null = False)
    gender = models.CharField(max_length = 20, choices=[('Male', 'Male'), ('Female', 'Female')],null=True)
    prefer_type = models.CharField(max_length = 20,
                                   choices = [('live', 'live'),('concert', 'concert'),
                                              ('opera','opera'), ('show', 'show')],null=True)
    cus_password = models.TextField(null = False)
    bill_address = models.TextField(max_length = 255, null = False)
    cus_phone = models.TextField(null = False)

    class Meta:
        db_table = 'Customer'
    
    def __str__(self):
        return self.cus_id


class Event_info(models.Model):
    event_id = models.AutoField(primary_key = True)
    event_name = models.TextField(max_length = 50, null = False)
    event_date = models.DateTimeField(blank = False, null = False)
    event_description = models.TextField(max_length = 5000, null = False)
    event_address = models.TextField(max_length = 50, null = False)
    
    event_image = models.ImageField(upload_to = 'static/', null = False)
    # 注意一下，static文件夹好像还没有设置过
    event_type = models.CharField(max_length = 20, choices = [('Concert', 'Concert'), ('live','live'), ('opera', 'opera')])
    ticket_amount = models.IntegerField(null = False)
    last_selling_date = models.DateTimeField(blank = False, null = False)
    organization = models.ForeignKey(Organizer, on_delete = models.SET_NULL, null=True)

    class Meta:
        db_table = 'Event_info'
    
    def __str__(self):
        return self.event_id


class Ticket_info(models.Model):
    ticket_id = models.AutoField(primary_key = True)
    ticket_type = models.IntegerField(null = False)
    ticket_amount = models.IntegerField(null = False)
    ticket_price = models.IntegerField(null = False)
    event = models.ForeignKey(Event_info,on_delete = models.SET_NULL, null = True)

    def __str__(self):
        return self.ticket_id

    class Meta:
        db_table = 'Ticket_info'

class Reservation(models.Model):
    reservation_id = models.AutoField(primary_key = True)
    reservation_time = models.DateTimeField(blank = True, null = False)
    customer = models.ForeignKey(Customer, on_delete = models.SET_NULL, null = True)
    event = models.ForeignKey(Event_info, on_delete = models.SET_NULL, null = True)

    def __str__(self):
        # 这个返回可能存在问题
        return self.reservation_id
    

    class Meta:
        db_table = 'Reservation'

class Comment_cus(models.Model):
    comment_id = models.AutoField(primary_key = True)
    comment_cus = models.TextField(max_length = 500, null = False)
    comment_time = models.DateTimeField(null = False)
    event = models.ForeignKey(Event_info, on_delete = models.SET_NULL, null = True)
    customer = models.ForeignKey(Customer, on_delete = models.SET_NULL, null = True)

    def __str__(self):
        # 可能不该返回comment_id
        return self.comment_id
    class Meta:
        db_table = 'Comment_cus'

class Reply_org(models.Model):
    reply_id = models.AutoField(primary_key = True)
    reply_org = models.TextField()
    reply_time = models.DateTimeField()
    event = models.ForeignKey(Event_info, on_delete = models.SET_NULL, null = True)
    organization = models.ForeignKey(Organizer, on_delete = models.SET_NULL, null = True)

    class Meta:
        db_table = 'Reply_org'
    
    def __str__(self):
        # 可能不该返回reply_id
        return self.reply_id