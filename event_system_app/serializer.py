from rest_framework import serializers
from . models import *

class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizer
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class EventinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_info
        fields = '__all__'

class TicketinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket_info
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

class CommentcusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment_cus
        fields = '__all__'

class ReplyorgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply_org
        fields = '__all__'
