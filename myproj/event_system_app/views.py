from django.db.models import Prefetch
import numpy as np
from sklearn.metrics import jaccard_score
import paypalrestsdk
import random
import string
from django.core.cache import cache
from django.core.mail import send_mail, send_mass_mail
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import *
import json
from rest_framework import status
from django.conf import settings
from django.db.models import Sum, F, ExpressionWrapper, FloatField
from django.contrib.auth.hashers import make_password, check_password
from django.db.models.functions import TruncMonth, TruncQuarter
from django.db.models import Sum, Count, Case, When, IntegerField, CharField, Value, Avg


organizer_list = ['org_id', 'org_email', 'org_password', 'company_name', 'company_address', 'org_phone']

customer_list = ['cus_id', 'cus_name', 'cus_email', 'gender', 'prefer_type', 'cus_password', 'bill_address', 'cus_phone']

event_info_list = ['event_id', 'event_name', 'event_date', 'event_description', 'event_address', 'event_type']


paypalrestsdk.configure({
    "mode": settings.PAYPAL_MODE,
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_CLIENT_SECRET
})


def data_match(fields_list, input_data): #This is used to match the data queried from the database with the model into a dictionary
    return {field: getattr(input_data, field, None) for field in fields_list if hasattr(input_data, field)}


def event_update_email(event_id, fields): # Function to send emails after the performance party has modified key performance information
    event = get_object_or_404(Event_info, pk = event_id)
    reservations = Reservation.objects.filter(event = event)
    customer_emails = [reservation.customer.cus_email for reservation in reservations]

    email_subject = 'Event Information Updated'
    email_message = f'The following event information has been updated: {", ".join(fields)}.'
    from_email = settings.EMAIL_HOST_USER

    # Create a list of email data tuples
    emails = [(email_subject, email_message, from_email, [email]) for email in customer_emails]

    # Send emails in bulk
    send_mass_mail(tuple(emails), fail_silently = False)
    return


# Convert the set of tags into a vector
def tags_to_vector(tags, all_tags):
    return np.array([int(tag in tags) for tag in all_tags])


def jaccard_sim(customer_tags, event_tags):


    live_tags = ['rock', 'pop', 'electronic', 'jazz', 'acoustic', 'indie', 'folk', 'blues', 'country', 'reggae']
    show_tags = ['magic', 'dance', 'circus', 'drama', 'puppetry', 'illusion', 'mime', 'ballet', 'opera', 'theater']
    comedy_tags = ['standup', 'improv', 'satire', 'sketch', 'dark', 'parody', 'slapstick', 'absurdist', 'observational', 'situational']
    opera_tags = ['classic', 'modern', 'experimental', 'baroque', 'romantic', 'italian', 'german', 'french', 'russian', 'english']

    all_tags = live_tags + show_tags + comedy_tags + opera_tags
    all_tags_list = list(all_tags)

    user_vector = tags_to_vector(customer_tags, all_tags_list)
    jaccard_scores = {}
    for event, tags in event_tags.items():
        event_vector = tags_to_vector(tags, all_tags_list)
        score = jaccard_score(user_vector, event_vector, average='binary')
        jaccard_scores[event] = score
    
    # sorted_dict = dict(sorted(jaccard_scores.items(), key=lambda item: item[1], reverse=True))
    return jaccard_scores



'''
200: success back data
400: Data error or returned data format error
405: Requested method error

code: 1 represents success, 2 represents failure, 3 represents illegal data, 4 represents call failure
'''

# MainPage function
     # 1) Filter function by time and type
     # 2) Keyword search function
class MainPage:
    @api_view(['GET']) #Time and type filtering function
    def mainpage_filter_events(request): #Finished test
        '''
     In the mainpage interface, the user has to choose two types, the first is the performance type and the second is the time type. This function returns the filtered performances based on the user's selection
     :param request: None
     :return: List type, the list element is a dictionary, and the dictionary contains
                 {
                     'event_id',
                     'event_name',
                     'event_date',
                     'event_description',
                     'event_address',
                     'event_type'
                 }
                 '''
        event_type_list = ['concert', 'live', 'comedy', 'opera']

        now = timezone.now()

        queryset = Event_info.objects.filter(event_date__gt=now)

        queryset = queryset.filter(event_type__in=event_type_list)
        events = list(
            queryset.values('event_id', 'event_name', 'event_date', 'event_description', 'event_address', 'event_type'))

        events = list(Event_info.objects.all().values('event_id', 'event_name', 'event_date', 'event_description', 'event_address', 'event_type'))

        empty_dict = []
        for i in events:
            filtered_event_data = {key: i[key] for key in ["event_name", "event_type", 'event_id', 'event_date', 'event_description']}
            empty_dict.append(filtered_event_data)

        return JsonResponse(empty_dict, safe = False, status = 200)


#CustomerFunction
# 1) The show for which the user ordered tickets
# 2) The user canceled the ticket for the show
# 3) Display detailed information about a user’s ticket purchase
class CusAccountFunction:
    @api_view(['GET']) 
    def upcoming_and_past(request):#Finished test
        '''
     Function: Return all ordered performances of this person based on userid
     Receive parameters: Get user_id from url
     :return: list, the parameter in the list is a dictionary, the dictionary format is as follows
         {
             'event_id':
             'event_name':
             'event_date':
             'event_address':
         }
         Attachment: Nicole said that the user_id passed here must be the customer identity, and no identity determination will be done here.
                 '''
        if request.method == 'GET':
            cus_id = request.query_params.get('user_id', None)
            if cus_id is None:
                return Response({'code':'3','message':'there is something wrong with the input data'}, status = 404)
            # cus_id = data['user_id']
            customer = Customer.objects.filter(cus_id = cus_id).first()

            reservations = Reservation.objects.filter(customer=customer).select_related('event', 'ticket')

        # Initialize a dictionary to store performance information and ticketing information
        events_info = []

        # Traverse all booking records
        for reservation in reservations:
            event = reservation.event
            events_info.append({
                'event_id': event.event_id,
                'event_name': event.event_name,
                'event_date': event.event_date,
                'event_address': event.event_address,
            })
        
        return Response({
            'code':'1',
            'message':'successful from getting values',
            'token':events_info
            }, status = 200)
    
    @api_view(['GET'])
    def canceled_events(request): #测试完成
        '''
         Receive: user_id, which must be of customer type. Get from url
         :return: dictionary, canceled ticket information
             {
             'event_id':
             'event_name':
             'event_date':
             'event_address':
                         }
                 '''
        if request.method == 'GET':

            user_id = request.query_params.get('user_id', None)

            user = Customer.objects.filter(cus_id=user_id).first()
            

            if not user:
                return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
            

            cancellations = Cancel.objects.filter(customer=user).select_related('event', 'ticket')
            

            cancellations_info = {}
            

            for cancellation in cancellations:
                event = cancellation.event
                cancellations_info['event_id']={
                    'event_id':event.event_id,
                    'event_name':event.event_name,
                    'event_date':event.event_date,
                    'event_address':event.event_address,
                }

            return Response({
                'code': '1',
                'message':'successfully find',
                'data': cancellations_info
            }, status = 200)

        return Response({
            'code': '4',
            'message': 'You have to use GET method'
        }, status = 405)

    @api_view(['GET'])
    def event_ticket(request): #Finished test
        '''
         View the booking information for a performance ordered by this audience
         Receive parameters:
             user_id: consumer's id, obtained from the url (must be the consumer)
             event_id: the id of the performance, obtained from the url
         :return:
             List, the list element is a dictionary, the dictionary format is as follows
             {
             'reservation_id':
             'ticket_type':
             'reserve_seat':
             'amount':
             'ticket_price':
             'total_price':
             'reserving_time':
                     }
                 '''
        if request.method == 'GET':
            user_id = request.query_params.get('user_id', None)  # Use get to avoid KeyError exceptions
            event_id = request.query_params.get('event_id', None)  # Use get to avoid KeyError exceptions

            customer = Customer.objects.filter(cus_id = user_id).first()
            event = Event_info.objects.filter(event_id = event_id).first()
            reservations = Reservation.objects.filter(customer=customer, event=event).all()


            if not reservations.exists():
                return Response({
                    'code': '2',
                    'message': 'No data here',
                }, status=404)


            reservations_info = []

            for reservation in reservations:
                ticket = reservation.ticket
                reservations_info.append({
                    'reservation_id': reservation.reservation_id,  # Assume that the primary key of the reservation model is id
                    'ticket_type': ticket.ticket_type,
                    'reserve_seat':reservation.reserve_seat,
                    'amount': reservation.amount,
                    'ticket_price': ticket.ticket_price,
                    'total_price': reservation.amount*ticket.ticket_price,
                    'reserving_time':reservation.reservation_time
            })

            return Response({
                'code':'1',
                'message':'successfully finding the data',
                'token':reservations_info
            }, status = 200)


        return Response({
            'code': '4',
            'message': 'You have to use GET method'
        }, status = 405)
    
    @api_view(['GET'])
    def event_recommend(request):
        '''
         Recommended performance function, using jaccard similarity
         Receive parameters: user_id, which must be the customer's id. Get from url
         :return: All data events in the database, arranged in order of score. List, the list elements are dictionaries, the format is as follows
             {
              'event_id':single.event_id,
              'event_name':single.event_name,
              'event_date':single.event_date,
              'address':single.event_address
                         }
                 '''
        if request.method == 'GET':
            user_id = request.query_params.get('user_id', None)
            customer = Customer.objects.filter(cus_id = user_id).first()
            event_list = []

            if customer is None: #If you can’t find anyone

                return Response({
                    'code':'2', 
                    'message':'We can not find the customer'
                },  status = 400)

            now = timezone.now()

            reserved_event_ids = Reservation.objects.filter(customer=customer).values_list('event__event_id', flat=True)

            available_events = Event_info.objects.filter(event_date__gt=now).exclude(event_id__in=reserved_event_ids)
            if available_events.count() == 0:
                return Response({'code':'1'})
            # print("come here 5")
            if customer.prefer_tags is None: #If this person does not write a tag
                # print("come here 6")
                if customer.prefer_type: #If this person writes what type of show they like
                    # print("come here 7")
                    special_type_events = available_events.filter(event_type=customer.prefer_type).all()
                    not_special_type_events = available_events.exclude(event_type=customer.prefer_type).all()

                    # print("come here 8")
                    for single in special_type_events:
                        event_list.append(
                            {
                                'event_id':single.event_id,
                                'event_name':single.event_name,
                                'event_date':single.event_date,
                                'address':single.event_address,
                                'event_type':single.event_type,
                                'event_description':single.event_description
                            }
                        )
                    # print("come here 9")
                    for single in not_special_type_events:
                        event_list.append(
                            {
                                'event_id':single.event_id,
                                'event_name':single.event_name,
                                'event_date':single.event_date,
                                'address':single.event_address,
                                'event_type':single.event_type,
                                'event_description':single.event_description
                            }
                        )
                    # print("come here 10")
                else:
                    for single in available_events:
                        event_list.append(
                            {
                                'event_id':single.event_id,
                                'event_name':single.event_name,
                                'event_date':single.event_date,
                                'address':single.event_address,
                                'event_type':single.event_type,
                                'event_description':single.event_description
                            }
                        )
                    print("come here 11")
            else: # If this person writes the tag, he can make recommendations
                event_tags_dict = {}
                empty_list = []
                print("come here 12")


                print(available_events)
                for event in available_events:
                    print(event.event_tags)
                    if event.event_tags is None:
                        empty_list.append(event.event_id)
                    else:
                        event_tags_dict[event.event_id] = event.event_tags
                print("come here 13")
                print(event_tags_dict)
                if event_tags_dict: # Only when there is something inside, we start using the jaccard algorithm
                    print("come here 14")
                    result = jaccard_sim(customer.prefer_tags, event_tags_dict)

                for event in empty_list: #Set the score of the performance whose tag is none to 0 and add it to it
                    print("come here 15")
                    result[event] = 0
                print("come here 16")
                sorted_dict = dict(sorted(result.items(), key=lambda item: item[1], reverse=True))
                print("come here 17")
                keys_in_order = list(sorted_dict.keys())
                print("come here 18")
                for single_keys in keys_in_order[:10]:
                    event_list.append(Event_info.objects.filter(event_id = single_keys).
                                    values(
                                        'event_id', 
                                        'event_name', 
                                        'event_date', 
                                        'event_address',
                                        'event_type',
                                        'event_type',
                                        'event_description'
                                           ).first())
                print("come here 19")
            return Response({
                'code':'1', 
                'message':'successfully jaccard',
                'token':event_list
                }, status = 200)
        print("come here 20")
        return Response({
            'code':'4', 
            'message':'The function is not right', 
            }, status = 400)
 

#LoginPage
# 1)Send verification code function
# 2)Reset password function
# 3) User login function
# 4) User registration function
class LoginPage:
    @api_view(['POST'])
    def send_reset_code(request):
        '''
         Send verification code function,
         Receive parameters: email, obtained from the sending form
         :return: message
                 '''
        email = request.data.get('email')
        if not email:
            return Response({
                'code':'2',
                'error': 'Email is required'
            }, status = 400)
        customer = Customer.objects.filter(cus_email = email).first()
        organizer = Organizer.objects.filter(org_email = email).first()
        if customer is None and organizer is None:
            return Response({
                'code':'2',
                'error': 'Email does not exist'
            }, status = 400)
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
        cache.set(f'password_reset_code_{email}', code, timeout = 60)
        
        send_mail(
            'Your Password Reset Code',
            f'Your password reset code is: {code}',
            '2545322339@foxmail.com',  # sender
            [email],
            fail_silently=False,
        )
        return Response({
            'code':'1',
            'message': 'Verification code sent successfully'
        },status = 200)

    @api_view(['POST'])
    def reset_password(request):
        '''
         Verify that the verification code is correct and change the password
         Receive data:
             email：mailbox
             code: verification code
             new_password: new password
             All obtained from the submitted form
         :return:
                 '''
        email = request.data.get('email')
        code = request.data.get('code')
        new_password = request.data.get('newPassword')

        if not all([email, code, new_password]):
            return Response({
                'code':'3',
                'error': 'Missing parameters'
            }, status = 400)
        
        cached_code = cache.get(f'password_reset_code_{email}')

        if cached_code is None or cached_code != code:
            return JsonResponse({'error': 'Invalid or expired code'}, status = 400)
        customer = Customer.objects.filter(cus_email = email).first()
        if customer:
            customer = data_match(customer_list, customer)
            customer['cus_password'] = make_password(new_password)
            Customer(**customer).save()
        else:
            organizer = Organizer.objects.filter(org_email = email).first()
            organizer = data_match(organizer_list, organizer)
            organizer['org_password'] = make_password(new_password)
            Organizer(**organizer).save()
        cache.delete(f'password_reset_code_{email}')
        return Response({
            'code':'1',
            'message': 'Password has been reset successfully'
        },status = 200)

    @csrf_exempt
    @api_view(['POST'])
    def user_login(request):
        '''
         The front-end login page obtains data from the front-end form and determines whether it is correct.
         Receive parameters:
             email:
             password:

         Return type:
         message: string indicating successful login or failed login
         code: 1 represents success, 2 represents failure, 3 represents illegal data, 4 represents call failure
         user_id: Only available when the login is successful, not when the login fails. When successful, the ID of the person in the database is returned.
                 '''
        # print(request.method == 'POST')
        if request.method == 'POST':

            try:
                # print("comer here 1")
                data = json.loads(request.body)
                email = data['email']
                password = data['password']
                # print("comer here 2")
                customer_data = Customer.objects.filter(cus_email = email).first()  # 正式代码
                customer = data_match(customer_list, customer_data)
                # print("comer here 3")
                if customer:  # This customer can be found
                    # print("comer here 4")
                    if check_password(password, customer['cus_password']):
                        # print("comer here 5")
                    # if customer['cus_password'] == password:
                        # return Response({'code': 1, 'message': 'login success',"user_type": "customer", "token": [customer['cus_id'], customer['cus_name'], customer['cus_email']]}, status = 200)
                        print(customer)

                        print(type(customer['cus_id']))
                        cache.set(customer['cus_id'], {
                            'role': 'customer',
                            'id': customer['cus_id'],
                            'email': customer['cus_email']
                        }, timeout=60000)

                        return Response({'code': 1, 'message': 'login success', "user_type": "customer",
                                         "token": customer['cus_id']},
                                        status=200)
                    else:
                        cache.set(0, {'role': None, 'id': None,
                                      'email': None}, timeout=60000)
                        return Response({'code': '2', 'message': 'login failed, please check email/password',"user_type": None}, status = 400)
                        
                else:  # It is possible that this person is an organizer
                    # print("comer here 7")
                    organizer_data = Organizer.objects.filter(org_email=email).first()
                    # print(organizer_data.org_email)
                    organizer = data_match(organizer_list, organizer_data)
                    if organizer:
                        # if organizer['org_password'] == data['password']: # Indicates that it matches
                        # print("comer here 8")
                        if check_password(password, organizer['org_password']):
                            # print("comer here 9")
                            # return Response({'code': '1', 'message': 'login success', "user_type": "organizer", "token": [organizer['org_id'], organizer['org_email'], organizer['company_name']]}, status = 200)

                            cache.set(organizer['org_id'], {
                                'role': 'organizer',
                                'id': organizer['org_id'],
                                'email': organizer['org_email']
                            }, timeout = 60000)


                            return Response({'code': '1', 'message': 'login success', "user_type": "organizer",
                                            "token": organizer['org_id']}, status=200)

                        else:  # Indicates that there is an error in the password or other things
                            # print("comer here 10")
                            cache.set(0, {'role': None, 'id': None,
                                                             'email': None}, timeout=60000)

                            return Response({'code': '2', 'message': 'login failed, please check email/password',"user_type": None }, status = 400)

                    cache.set(0, {'role': None, 'id': None,
                                                     'email': None}, timeout=60000)
                    return Response({'code': '2', 'message': 'login failed, please check email/password',"user_type": None }, status = 400)
                        
            except json.JSONDecodeError:
                # print("comer here 11")

                cache.set(0, {'role': None, 'id': None,
                                                 'email': None}, timeout=60000)

                return Response({'code': '1', 'message': 'Invalid json data'}, status = 400)


        cache.set(0, {'role': None, 'id': None,
                      'email': None}, timeout=60000)
        return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)

    @api_view(['GET'])
    def get_cache_data(request):

        user_id = request.query_params.get('user_id', 0)
        if user_id != 0:
            # Use cached user information
            user_info = cache.get(int(user_id))
            # print(user_info)
            return Response({
                'role': user_info['role'],
                'id': user_info['id'],
                'email': user_info['email']
            }, status = 200)
        else:
            # Handle cache invalidation situations
            return Response({
                'role': None,
                'id': None,
                'email': None
            }, status=200)


    @api_view(['POST'])
    def register(request):
        """
         Get form data from frontend
         Return type:
         message: string indicating successful login or failed login
         code: 1 represents success, 2 represents failure, 3 represents illegal data, 4 represents call failure
         token: Only available when the login is successful, not when the login fails. When successful, the ID of the person in the database is returned.
                 """
        if request.method == 'POST':
            try:
                data = json.loads(request.body)

                if data['role'] == 'organizer':
                    organization_name = data['organization_name']
                    organization_address = data['organization_address']
                else:
                    username = data['username']
                    bill_address = data['bill_address']
                email = data['email']
                password = data['password']
                phone = data['phone']
                existing_organizer = Organizer.objects.filter(org_email=email).first()
                existing_customer = Customer.objects.filter(cus_email=email).first()

                if data['role'] == 'organizer':
                    if existing_organizer or existing_customer:  # Check if the same person exists in the database
                        return Response({'message': 'email already registered'}, status=400)
                    else:
                        new_organizer = Organizer(
                            org_id = Organizer.objects.count() + 1,
                            company_name = organization_name,
                            company_address = organization_address,
                            
                            org_email = email,
                            org_password = make_password(password),
                            org_phone = phone
                        )
                        new_organizer.save()
                        # The content of the response must be modified. All responses in this function

                    cache.set(new_organizer.org_id, {
                        'role': 'organizer',
                        'id': new_organizer.org_id,
                        'email': new_organizer.org_email
                    }, timeout=60000) # Cache for one hour

                    return Response({
                        'code': '1',
                        'message': 'JSON data received and processed successfully',
                        "token":new_organizer.org_id}, 
                    status = 200)

                elif data['role'] == 'customer':
                    if existing_customer or existing_organizer:  # Check if the same person exists in the database
                        return Response({
                            'code': '2', 
                            'message': 'email already registered'}, 
                        status = 400)
                    else:
                        # encrypted_password = make_password(password)
                        new_customer = Customer(
                            cus_name = username,
                            bill_address = bill_address,
                            cus_email = email,
                            cus_password = make_password(password),
                            cus_phone = phone,
                            gender = data.get('gender') if data.get('gender') else None,
                            # prefer_type = data['prefer_type'] if data['prefer_type'] else None,
                            # prefer_tags = data['prefer_tags'] if data['prefer_tags'] else None
                        )
                        new_customer.save()

                    cache.set(new_customer.cus_id, {
                        'role': 'customer',
                        'id': new_customer.cus_id,
                        'email': new_customer.cus_email
                    }, timeout=60000)


                    return Response({
                        'code': '1', 
                        'message': 'JSON data received and processed successfully', 
                        'token':new_customer.cus_id}, 
                    status = 200)
            except   json.JSONDecodeError:

                cache.set(0, {
                    'role': None,
                    'id': None,
                    'email': None
                }, timeout=60000)

                return Response({
                    'code': '3',
                    'message': 'Invalid JSON data'}, 
                status = 400)
        else:
            return Response({'code': '4', 'message': 'This view only accepts POST requests'}, status = 405)


# User Account Page
# 1) Consumer personal information display
# 2) Organizer’s personal information display
# 3) Edit consumer personal information, edit and save
# 4) Edit and save organizer’s personal information
class AccountInfoPage:
    @api_view(['GET'])
    def cus_info_show(request):
        '''

        :param user_id:
        :return:
        '''

        if request.method == 'GET':
            user_id = request.query_params.get('user_id', None)
            customer = Customer.objects.filter(cus_id = user_id).first()
            
            empty_dict = {
                'cus_name':customer.cus_name,
                'cus_email':customer.cus_email,
                'cus_phone':customer.cus_phone,
                'bill_address':customer.bill_address,
                'gender':customer.gender,
                'age_area':customer.age_area,
                'prefer_tags':customer.prefer_tags,
                'prefer_type':customer.prefer_type
            }
            
            if customer:
                return JsonResponse(empty_dict, status = 200)
                # Found the data and returned successfully
            else:
                # The account page is sent to request the consumer's personal information, but no such person is found. It is basically impossible, but this function is still written.
                return Response({
                    'code': '4',
                    'message': 'This customer is not exist, you can not enter in account page'
                }, status = 404)
        else:
            return Response({
                'code': '4',
                'message': 'This function only accepts GET data'
            }, status = 405)


    @api_view(['GET'])
    def org_info_show(request):
        '''
         This function is used to navigate to the account page and return the organizer's personal user information.
         Receive parameter user_id is obtained from url
         Returns: organizer entire type
         (There may be a bug, that is, the front end cannot parse query type data)
                 '''
        if request.method == 'GET':
            
            user_id = request.query_params.get('user_id', None)

            organizer = Organizer.objects.filter(org_id = user_id).first()
            if organizer:
                organizer = data_match(organizer_list, organizer)
                return Response({
                    'code': 1,
                    'message': 'login success',
                    "user_type": "organizer",
                    "token": organizer
                }, status = 200)
                # Found the data and returned successfully
            else:
                # The account page is sent to request the consumer's personal information, but no such person is found. It is basically impossible, but this function is still written.
                return Response({
                    'code': '2',
                    'message': 'This organizer is not exist, you can not enter in account page'
                }, status = 404)
        else:
            return Response({
                'code': '4',
                'message': 'This function only accepts GET data'
            }, status = 405)


    @api_view(['PUT'])
    def edit_cus_info(request):
        '''
         Modify personal data of datacus
         Receive parameters, all parameters of the cus page
         Receive parameter format:
             json dictionary data
             customer['cus_name'] = data['name']
             customer['cus_email'] = data['email']
             customer['gender'] = data['gender']
             customer['bill_address'] = data['bill_address']
             customer['cus_phone'] = data['phone']
             customer['prefer_tags'] = data['prefer_tags']
         :return: code and message
         '''
        if request.method == 'PUT':
            user_id = request.query_params.get('user_id', None)
            try:
                data = json.loads(request.body)
            except Exception as e:
                return Response({
                    'code': '3', 'message': 'Invalid json data'
                }, status = 200)

            customer = Customer.objects.filter(cus_id = user_id).first()

            if customer.cus_email != data['cus_email']:
                organizer = Organizer.objects.filter(org_email = data['email']).count()
                new_customer = Customer.objects.filter(cus_email = data['email']).count()
                if new_customer != 0 or organizer != 0:
                    return Response({
                        'code':'2',
                        "message":'The email is already exist'
                    }, status = 200)
            
            customer.cus_name = data['cus_name']
            customer.cus_email = data['cus_email']
            customer.gender = data['gender']
            customer.bill_address = data['bill_address']
            customer.cus_phone = data['cus_phone']
            customer.age_area = data['age_area']
            customer.prefer_tags = data['prefer_tags']
            customer.save()
            return Response({
                'code': '1',
                'message':'Successful from saving data'
            }, status = 200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)

    @api_view(['PUT'])
    def edit_org_info(request):
        '''
         Modify the account information of the org account. Receive data from sent form
                       json dictionary data
             organizer['company_name'] = data['name']
             organizer['org_email'] = data['email']
             organizer['company_address'] = data['address']
             organizer['org_phone'] = data['phone']
         :return:
                 '''
        if request.method == 'PUT':
            user_id = request.query_params.get('user_id', None)
            try:
                data = json.loads(request.body)
            except Exception as e:
                return Response({
                    'code': '3',
                    'message': 'Invalid json data'
                }, status = 400)

            organizer = Organizer.objects.filter(org_id = user_id).first()
            

            if organizer.org_email != data['email']:
                customer = Customer.objects.filter(cus_email = data['email']).count()
                new_organizer = Organizer.objects.filter(org_email = data['email']).count()
                if new_organizer != 0 or customer !=0 :
                    return Response({
                        'code':'2',
                        "message":'The email is already exist'
                    }, status = 200)

            organizer.company_name = data['name']
            organizer.org_email = data['email']
            organizer.company_address = data['billAddress']
            organizer.org_phone = data['phoneNumber']
            organizer.save()
            return Response({
                'code': '1',
                'message':'Successful from saving data'
            }, status = 200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)

def seat_pool_cal(ticket_type, amount):
    seat_pool_list = []
    for single_seat in range(1, amount):
        row_number = single_seat // 20 + 1
        seat_number = single_seat % 20 + 1
        seat_assignment = f"{ticket_type}-{row_number}-{seat_number}"
        seat_pool_list.append(seat_assignment)
    seat_pool_string = ','.join(seat_pool_list)
    return seat_pool_string


def seat_booking(ticket, amount):
    all_string = ticket.ticket_seat_pool.split(',')
    booking_seat = all_string[:amount]
    remain_seat = all_string[amount:]
    ticket.ticket_seat_pool = ','.join(remain_seat)
    ticket.save()
    return ','.join(booking_seat)



# Function to create a show
# Modify the function of the performance
# Delete performance function
# The function of querying history and creating performances
class OrganizerFunctionPage:
    @api_view(['POST'])
    def event_create(request):
        '''
         Create a show. Receive form information from the front end
             The form information includes
             event_name = event_data['event_name'],
             event_date = event_data['event_date'],
             event_description = event_data['event_description'],
             event_address = event_data['event_address'],
             event_image_url = event_data['event_image_url'], # Make sure the image upload is handled here
             event_type = event_data['event_type'] , #event_type must have a type and cannot be empty
             event_last_selling_date = event_data['event_last_selling_date'],
             event_tags = event_data['event_tags'] if event_data['event_tags'] else None,
             organization = organizer, # Assume that the front end sends the organization ID

         :return: code and message
                 '''
        if request.method == 'POST':
            user_id = request.query_params.get('user_id',None)
            try:
                event_data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError:
                return Response({'code': '3', 'message': 'Invalid json data'}, status = 400)

            organizer = Organizer.objects.filter(org_id = user_id).first()

            event = Event_info(
                event_name = event_data['event_name'],
                event_date = event_data['event_date'],
                event_description = event_data['event_description'],
                event_address = event_data['event_address'],
                event_image_url = event_data['event_image_url'],
                event_type = event_data['event_type'] , #event_type must have a type and cannot be empty
                event_last_selling_date = event_data['event_last_selling_date'],
                event_tags = event_data['event_tags'] if event_data['event_tags'] else None,
                organization = organizer,  # Assume that the front end sends the organization ID
            )
            event.save()  # Save the event object so it has an ID
            for ticket in event_data['tickets']:

                seat_pool_string = seat_pool_cal(ticket['ticket_type'], ticket['ticket_amount'])

                ticket = Ticket_info(
                    ticket_type = ticket['ticket_type'],
                    ticket_name = "Reserve" + str(ticket['ticket_type']),
                    ticket_amount = ticket['ticket_amount'],
                    ticket_price = ticket['ticket_price'],
                    ticket_remain = ticket['ticket_amount'],
                    ticket_seat_pool = seat_pool_string,
                    event = event
                )
                ticket.save()  #Save ticket object
            return Response({
                "code":"1",
                "message":"Event successfully created"
            }, status = 200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)

    @api_view(['PUT'])
    def edit_event(request):

        if request.method == "PUT":
            event_id = request.query_params.get('event_id', None)
            try:
                data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError:
                #     # print("event_data)
                #     # print(type(event_data))
                #     # print(event_data)
                return Response({'code': '3', 'message': 'Invalid json data'}, status=400)
            event = Event_info.objects.filter(event_id=event_id).first()

            event.event_date = data['event_date']
            event.event_description = data['event_description']
            event.event_type = data['event_type']
            event.event_name = data['event_name']
            event.event_address = data['event_address']
            event.save()

            return JsonResponse({
                'code': '1',
                'message': 'Event updated and email sent'
            }, status=200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status=405)
      
    @api_view(['DELETE'])
    def delete_event(request):
        '''
         The accepted data format is int
         It is the event_id of the event. The situation of foxapi is defined in the body.
         Reasons for failure will be displayed: 1. The event cannot be found. 2. The event id was not detected.
         Successful display: The event is deleted successfully. Also delete reservation records, refunds, and mass emails.
                 '''
        if request.method == "DELETE":
            event_id = request.query_params.get('event_id', None)  # Accessing the ID from request body
            if event_id is not None:
                try:
                    # First collect the email addresses of all users who have subscribed to the event
                    reservations = Reservation.objects.filter(event_id=event_id).select_related('customer')
                    recipients = [reservation.customer.cus_email for reservation in reservations if reservation.customer.cus_email]

                    # Try to find the event and delete it
                    event = Event_info.objects.get(event_id=event_id)
                    event_name = event.event_name  # Store event name for use in email content
                    event.delete()
                    
                    # Send email notification
                    if recipients:  # Make sure the recipient address list is not empty
                        subject = "Event Cancellation Notice"
                        message = f"We regret to inform you that the event '{event_name}' you had reserved tickets for has been cancelled. We apologize for any inconvenience this may cause."
                        send_mail(
                            subject,
                            message,
                            '2545322339@foxmail.com',  # Replace with your sending email address
                            recipients,
                            fail_silently=False,
                        )
                    
                    return Response({
                        "code":"1",
                        'message': 'Event deleted successfully and email sent'
                    }, status = 200)
                except Event_info.DoesNotExist:
                    return Response({
                        "code":"4",
                        'message': 'Event not found'
                    }, status=404)
            else:
                return Response({
                    "code":"3",
                    'message': 'Event ID is required'
                }, status=403)

    @api_view(['GET'])
    def created_events(request):
        '''
         Use this function to retrieve all shows that have been created.
         Pass in user_id (must be the id of org). Pass in from url
         return: a list, the elements in the list are dictionaries, the dictionary format is as follows
             {
             'event_id',
             'event_name',
             'event_date',
             'event_address'
             }
         There may be a hidden danger here, that is, when an abnormal performance does not have tickets information, an error may occur.
                 '''
        if request.method == 'GET':
            org_id = request.query_params.get('user_id', None)

            organizer = Organizer.objects.get(org_id=org_id)
            if organizer is None:
                return Response({
                    'code':'2',
                    'message':'failed from finding this organizer'
                }, status = 404)

            # Get all Event_info created by this Organizer
            events = Event_info.objects.filter(organization=organizer).values(
                'event_id', 'event_name', 'event_date', 'event_address'
            )
            if not events.exists():
                return Response({
                    'code':'2',
                    'message':'There is no recorded data for this organizer'
                }, status = 404)

            return Response({
                'code':'1',
                'message':'success get the past data',
                'token':events
            }, status = 200)
    
        return Response({
            'code':'4',
            'message':'The method is not allowed'
        }, status = 405)

    @api_view(['GET'])
    def data_showing_check(request):
        if request.method == 'GET':
            event_id = request.query_params.get('event_id', None)
            # user_id = request.query_params.get('user_id', None)

            event = Event_info.objects.filter(event_id = event_id).first()
            
            tickets = Ticket_info.objects.filter(event = event).all()
            if tickets is None:
                return Response({
                    'code':'2',
                    'message':'We did not find any data'
                    }, status = 404)

            ticket_list = []

            for ticket in tickets:
                ticket_list.append({
                    'ticket_id':ticket.ticket_id,
                    # 'ticket_type':ticket.ticket_type,
                    'ticket_price':ticket.ticket_price,
                    'ticket_name':ticket.ticket_name,
                    'ticket_remain':ticket.ticket_remain,
                    'sold_amount':ticket.ticket_amount - ticket.ticket_remain
                })
            return Response({
                'code':'1',
                'message':'We find the data',
                'token':ticket_list
            })

        return Response({
            'code':'4',
            'message':'The method is not allowed'
        }, status = 405)


#Event detail page
# 1) Performance information display function
# 2) Ticket booking function
#3)Comment function
# 4) Reply to comments function
#5) Like function
class EventDetailPage:
    @api_view(['GET'])
    def get_event_detail(request):

        print(request.method)
        if request.method == 'GET':
            # print("come here 1")
            event_id = request.query_params.get('event_id', None)
            if event_id:
                # print("come here 2")
                event = Event_info.objects.filter(event_id = event_id).first() # Find this event first
                ticket_set = Ticket_info.objects.filter(event = event).all() #Query the ticket type for this show
                ticket_dict = {}
                # print("come here 3")
                for ticket in ticket_set:
                    ticket_dict[ticket.ticket_type] = [ticket.ticket_remain, ticket.ticket_price]
                cus_comments = Comment_cus.objects.filter(event = event).all()
                rate_num = 0
                # print("come here 4")
                total_rate = 0
                for single_comment in cus_comments:
                    if single_comment.event_rate is not None:
                        total_rate += single_comment.event_rate
                        rate_num += 1
                # print("come here 5")

                ave_rate = round(total_rate / rate_num, 1) if rate_num > 0 else 0

                frontend_data = {
                    'id':event.event_id,
                    'title':event.event_name,
                    'date':event.event_date,
                    'location':event.event_address,
                    'description':event.event_description,
                    'last_selling_date':event.event_last_selling_date,
                    'event_tags':event.event_tags,
                    'image':event.event_image_url,
                    'type':event.event_type,
                    'total_rating':ave_rate,
                    'tickets':ticket_dict,
                }
                # print("come here 6")
                return Response({
                    'code':'1',
                    'message':'Successfuly fingding',
                    "token":frontend_data
                }, status = 200)
            else:
                # print("come here 7")
                return Response({
                    'code': '3',
                    'message': 'There is no event id in it'
                }, status = 400)
        # print("come here 8")
        return Response({
            'code': '4', 
            'message': 'This function only accepts POST data'
        }, status = 405)

    @api_view(['GET'])
    def get_comment(request):
        '''
         Get all comments under an event. Pass in event_id, passed in from the url

         :return: a list whose elements are dictionaries
         The format is as follows:
         {
             "comment_id": comment.comment_id,
             "event_rate": comment.event_rate,
             "comment": comment.comment_cus,
             "comment_time": comment.comment_time,
             "replies":{
                 "reply_id": reply.reply_id,
                 "reply_content": reply.reply_org,
                 "reply_time": reply.reply_time,
                 'reply_time':reply.reply_time
             }
         }
                 '''
        if request.method =='GET':

            comments_with_replies = []
            event_id = request.query_params.get('event_id', None)
            # print("come here 1")

            if event_id:
                comments_with_replies = []
                # print("come here 2")

                # Use Prefetch to optimize queries to avoid N+1 query problems
                replies_prefetch = Prefetch('replies', queryset = Reply_org.objects.all(), to_attr = 'fetched_replies')

                # print("come here 3")
                # Query the latest 50 comments for the specified performance, including pre-fetched replies
                comments = Comment_cus.objects.filter(event_id=event_id).\
                               prefetch_related(replies_prefetch).\
                                    order_by('-comment_time')[:50]

                # print(comments)
                # print("come here 4")
                # comments_with_replies = []

                # print("come here 5")
                for comment in comments:
                    comment_data = {
                        "comment_id": comment.comment_id,
                        "event_rate": comment.event_rate,
                        "comment": comment.comment_cus,
                        "comment_time": comment.comment_time,
                        "comment_image":comment.comment_image_url,
                        "replies": []
                    }
                    # print("come here 6")

                    # Check if there is a reply from the organizer and add it to the dictionary
                    if hasattr(comment, 'fetched_replies'):
                        print("come here 6.5")
                        for reply in comment.fetched_replies:
                            reply_data = {
                                "reply_id": reply.reply_id,
                                "reply_content": reply.reply_org,
                                "reply_time": reply.reply_time,
                                'reply_time':reply.reply_time
                            }
                            # print("come here 7")
                            comment_data["replies"].append(reply_data)

                    comments_with_replies.append(comment_data)
                    # print("come here 8")
            return Response({
                "token":comments_with_replies
            }, status = 200)

        return Response({'code': '4', 'message': 'This function only accepts GET data'}, status = 405)

    @api_view(['POST'])
    def cus_make_comment(request):
        '''
         Consumers make comments
         Receive parameters, event_id and cus_id from the url. Receive forms at the same time
         :return: code and message
                 '''
        # print(request.method)
        if request.method == 'POST':
            # print("success")
            
            data = request.data
            print("come here 1")

            event_id = request.query_params.get('event_id', None)
            cus_id = request.query_params.get('cus_id', None)

            event = Event_info.objects.filter(event_id = event_id).first()
            customer = Customer.objects.filter(cus_id = cus_id).first()
            print("come here 2")
            if event and customer:
                # print("come here 3")
                comment_num = Comment_cus.objects.filter(event = event, customer = customer).count()
                # print("come here 4")
                if comment_num != 0:
                    print("come here 5")
                    return Response({
                        'code':'2',
                        'message':'You have leave a comment before'
                    }, status = 200)
                if data:
                    print("come here 7")
                    comment = Comment_cus(
                        event_rate = int(data['event_rate']),
                        comment_cus = data['comment_cus'],
                        comment_time = timezone.now().replace(second=0, microsecond=0),
                        comment_image_url = data.get('comment_image_url') if data.get('comment_image_url') else None,
                        event = event,
                        customer = customer,
                        likes = 0
                    )
                    comment.save()
                    print("come here 8")
                    return Response({
                        'code':'1',
                        'message':'successfuly submit the comment'
                    }, status = 200)

                print("come here 9")
                return Response({
                    'code':'3',
                    'message':'The input data is not json form'
                }, status = 400)

            print("come here 10")
            return Response({
                'code':'2',
                'message':'We did not find the appropriate data'
            }, status = 404)

        print("come here 11")
        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)

    @api_view(['POST'])
    def org_make_reply(request):
        '''
         The organizer implements the function of replying to comments.
         Receive parameters: user_id and comment_id. Get from url
         :return: code and message
                 '''
        if request.method == 'POST':
            data = request.data
            user_id = request.query_params.get('user_id', None)
            comment_id = request.query_params.get('comment_id', None)

            organizer = Organizer.objects.filter(org_id = user_id).first()

            if organizer is None:# The current user must be the organizer to continue.
                return Response({'code':'3','message':'Can not find this organizer'}, status = 400)

            comment = Comment_cus.objects.filter(comment_id = comment_id).first()

            if comment is None:
                return Response({
                    'code':'2',
                    'message':'There is no comment data'
                }, status = 404) # This comment cannot be found

            real_organizer = comment.event.organization
            if organizer != real_organizer:
                return Response({
                    'code':'2',
                    'message':'Sorry, you are not the organizer of this event'
                }, status = 404) # The current organizer is not the organizer of this event
            past_reply = Reply_org.objects.filter(comment = comment).first()

            if past_reply is not None: # If this org has posted a reply under this comment before, it cannot reply again.
                return Response({
                    "code":'2',
                    "message":"You have already give the reply"
                }, status = 400)

            reply = Reply_org(
                reply_org = data['reply_org'],
                reply_time = timezone.now().replace(second=0, microsecond=0),
                event = comment.event,
                organization = organizer,
                comment = comment
            )
            reply.save()
            print(reply)

            return Response({
                'code':'1',
                'message':'Success'
            }, status = 200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)


# Ordering and cancellation functions
class PayAndCancel:
    @api_view(['GET'])
    def cus_ticket_number_check(request):
        cus_id = request.query_params.get('cus_id', None)
        event_id = request.query_params.get('event_id', None)

        customer = Customer.objects.filter(cus_id = cus_id).first()
        event = Event_info.objects.filter(event_id = event_id).first()

        if customer is None or event is None:
            return Response({
                'code':'2',
                'message':'There is something wrong with the input data'
            }, status = 200)

        current_tickets = Reservation.objects.filter(customer=customer, event=event).aggregate(total_tickets=models.Sum('amount'))

        return Response({
            'token':current_tickets['total_tickets'] if current_tickets['total_tickets'] else 0,
            'code':'1',
            'message':'Successful'
        }, status = 200)


    @api_view(['POST'])
    def payment(request):
        '''
         :request: Receive JSON format data, the data includes {ticket_type, ticket_number}. Get event_id and user_id from the url at the same time

         URL format: When passing in the URL, please pass it in as follows: http://127.0.0.1:8000/booking/?email=2545322339@qq.com&event_id=1

         :return: What the code represents
             1: Ticket booking successful
             2:Cannot find this ticket
             3: Insufficient votes remaining
             4: There are absolutely no votes left.
             5: There is a problem with the personal information or performance information entered.
             6: There is a problem with the data input format
                 '''
        user_id = request.query_params.get('user_id', None)
        event_id = request.query_params.get('event_id', None)

        if not user_id or not event_id:
            return Response({'code': '5', 'message': 'Missing email or event_id'}, status=400)

        if request.method == 'POST':
            try:
                data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError:
                return Response({'code': '6', 'message': 'Invalid json data'}, status=400)

            ticket_type = data.get('ticket_type')
            ticket_number = int(data.get('ticket_number', 0))

            if ticket_number > 0 and ticket_type:
                customer = Customer.objects.filter(cus_id=user_id).first()
                event = Event_info.objects.filter(event_id=event_id).first()
                ticket = Ticket_info.objects.filter(event=event, ticket_type=ticket_type).first()

                if ticket.ticket_remain >= ticket_number:

                    booking_seat_string = seat_booking(ticket, ticket_number)
                    history_booking = Reservation.objects.filter(customer=customer, event=event,
                                                                 ticket=ticket).first()
                    if history_booking:
                        history_booking.amount += ticket_number
                        history_booking.reserve_seat += "," + booking_seat_string
                        history_booking.save()
                    else:
                        new_reserve = Reservation(
                            reservation_time=timezone.now().replace(second=0, microsecond=0),
                            event=event,
                            customer=customer,
                            ticket=ticket,
                            amount=ticket_number,
                            reserve_seat=booking_seat_string
                        )
                        new_reserve.save()

                    ticket.ticket_remain -= ticket_number
                    if ticket.ticket_remain < 0:
                        ticket.ticket_remain = 0
                    ticket.save()
                    # Send email notification
                    send_mail(
                        'Booking Confirmation',
                        f'Your booking for {event.event_name} with {ticket_number} tickets of type {ticket_type} is confirmed.',
                        settings.EMAIL_HOST_USER,
                        [customer.cus_email],
                        fail_silently=False,
                    )

                    return Response({'code': '1', 'message': 'Successfully booking.'}, status=200)
                else:
                    return Response(
                        {'code': '3', 'message': 'There is no enough remain tickect for this type for this event.'},
                        status=200)
            else:
                return Response({'code': '6', 'message': 'something wrong with the input data'}, status=400)
        else:
            return Response({'code': '4', 'message': 'This function only accepts POST data'}, status=405)

    @api_view(['PUT'])
    def cancel_ticket(request):
        '''
         Function to cancel show tickets
         Receive parameters reservation_id and amount(quantity). Get from url
                 '''
        if request.method == 'PUT':

            reservation_id = request.query_params.get('reservation_id', None)
            amount = int(request.query_params.get('amount', 0))

            # print("come here 2")
            reservation = Reservation.objects.filter(reservation_id = reservation_id).first()
            # print("come here 3")
            if reservation is None:
                return Response({
                    "code":"2", 
                    "message":"Can not find this ticket"
                }, status = 404) # This booking information cannot be found
            
            if reservation.amount < amount:
                return Response({
                    "code":"3", 
                    "message":"You order to cancel too many"
                }, status = 404)# This booking information cannot be found

            # print("come here 4")
            customer = reservation.customer
            ticket = reservation.ticket

            seat_list = reservation.reserve_seat.split(',')

            print(seat_list)
            popped_elements = []
            for _ in range(amount):
                popped_elements.append(seat_list.pop(0))
            print(seat_list)
            reservation.reserve_seat = ",".join(seat_list)
            reservation.save()

            # print("come here 5")
            with transaction.atomic():
                customer.account_balance += ticket.ticket_price * amount
                customer.save()
                # print("come here 6")
                ticket.ticket_remain += amount
                ticket.save()
                # print("come here 7")
            
            if reservation.amount > amount:
                reservation.amount -= amount
                reservation.save()
                # print("come here 8")
            else:
                reservation.delete()
                # print("come here 9")
            
            cancel = Cancel(
                cancel_time = timezone.now().replace(second = 0,microsecond = 0),
                cancel_amount = amount,
                event =  reservation.event,
                ticket = ticket,
                customer = customer
            )
            cancel.save()
            # print("come here 10")

            return Response({
                'code':'1', 
                'message': 'Refund processed successfully'
            }, status = 200)
        
        return Response({
            'code':'4',
            'message':'Please use the POST method'
        }, status = 405)

    @api_view(['GET'])
    def process_payment(request):
        paypalrestsdk.configure({
            "mode": settings.PAYPAL_MODE,
            "client_id": settings.PAYPAL_CLIENT_ID,
            "client_secret": settings.PAYPAL_CLIENT_SECRET
        })
        amount = int(request.query_params.get('amount', 0))
        price = float(request.query_params.get('price', 0))
        if price <= 0 or amount <= 0:
            return Response({
                'code': '2',
                'message': 'There is something wrong with the input data'
            }, status=200)

        total_price = amount * price
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://127.0.0.1:8000/payment/execute/",
                "cancel_url": "http://127.0.0.1:8000/payment/cancel/"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "ticket",
                        "sku": "item",
                        "price": str(price),
                        "currency": "USD",
                        "quantity": amount
                    }]
                },
                "amount": {
                    "total": str(total_price),
                    "currency": "USD"
                },
                "description": "This is the payment transaction description."
            }]
        })

        if payment.create():
            for link in payment.links:
                if link.rel == "approval_url":
                    # Capture the url that the user must be redirected to to approve the payment
                    approval_url = str(link.href)
                    return JsonResponse({'approval_url': approval_url}, safe=False)
        else:
            return Response({
                'code':'2',
                'error': 'Payment creation failed'
            }, status=200)

        return Response({
            'code':'2',
            'error': 'Unknown error occurred'
        }, status=200)

    @api_view(['GET'])
    def execute_payment(request):
        payment_id = request.GET.get('paymentId')
        payer_id = request.GET.get('PayerID')

        if not payment_id or not payer_id:
            return Response({
                'code': '2',
                'message': 'There is something worng'
            }, status=200)

        payment = paypalrestsdk.Payment.find(payment_id)

        if payment.execute({"payer_id": payer_id}):
            # Here you can update order status, record payment success events, etc.
            return Response({
                'code': '1',
                'message': 'success'
            }, status=200)  # Redirect after successful payment
        else:
            # Record payment failure error messages, etc.
            return Response({
                'code': '3',
                'message': 'failed'
            }, status=500)
    

class OrganizerReport:
    '''
         Get_event_number is to enter org_id in params. If you want to change the function, it will be fine.
         2
         '''
    @api_view(['GET'])
    def get_event_number(request):
        if request.method == "GET":
            # Since it is a GET request, we get organizer_id from the query parameter
            org_id = request.query_params.get('user_id', None)


            if org_id is not None:
                events = Event_info.objects.filter(organization_id=org_id)
                

                total_events = events.count()
                

                past_events = events.filter(event_date__lt=timezone.now()).count()
                

                upcoming_events = events.filter(event_date__gte=timezone.now()).count()
                
                return Response({
                    "code": "1",
                    "total_events": total_events,
                    "past_events": past_events,
                    "upcoming_events": upcoming_events
                }, status=status.HTTP_200_OK)
            else:
                return Response({"code": "3", 'error': 'Organizer ID is required'}, status=status.HTTP_400_BAD_REQUEST)    

    @api_view(['GET'])
    def get_event_types_summary(request):
        if request.method == "GET":
            org_id = request.query_params.get('user_id', None)
            
            if org_id is not None:
                events = Event_info.objects.filter(organization_id=org_id)
                event_types_count = events.values('event_type').annotate(total=Count('event_type')).order_by('event_type')

                total_events = sum(item['total'] for item in event_types_count)
                
                if total_events > 0:

                    event_types_ratio = [{
                        **item, 
                        'ratio': round(item['total'] / total_events * 100, 2)
                    } for item in event_types_count]
                else:
                    event_types_ratio = []
                
                return Response({
                    "code": "1",
                    "event_types_summary": event_types_ratio
                }, status=status.HTTP_200_OK)
            else:
                return Response({"code": "3", 'error': 'Organizer ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['GET'])
    def events_by_total_tickets_sold(request):
        org_id = request.query_params.get('user_id', None)
        if org_id is not None:
            events_sorted_by_tickets_sold = Event_info.objects.filter(organization_id=org_id)\
                .annotate(sold_tickets=Sum(F('ticket_info__ticket_amount') - F('ticket_info__ticket_remain')))\
                .order_by('-sold_tickets')
            

            events_data = [{'event_name':event.event_name,'event_id': event.event_id, 'sold_tickets': event.sold_tickets} for event in events_sorted_by_tickets_sold]
            return Response(events_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Organizer ID is required"}, status=status.HTTP_400_BAD_REQUEST)    

    @api_view(['GET'])
    def events_by_total_revenue_and_type(request):
        org_id = request.query_params.get('user_id', None)
        if org_id is not None:
            events_sorted_by_revenue_and_type = Event_info.objects.filter(organization_id=org_id).values(
                'ticket_info__ticket_type'
            ).annotate(
                total_revenue=Sum(
                    ExpressionWrapper(
                        (F('ticket_info__ticket_amount') - F('ticket_info__ticket_remain')) * F('ticket_info__ticket_price'),
                        output_field=FloatField()
                    )
                )
            ).order_by('-total_revenue')

            return Response(list(events_sorted_by_revenue_and_type), status=status.HTTP_200_OK)
        else:
            return Response({"error": "Organizer ID is required"}, status=status.HTTP_400_BAD_REQUEST)
           
    @api_view(['GET'])
    def events_by_completion_rate(request):
        org_id = request.query_params.get('user_id', None)
        if org_id is not None:
            events_sorted_by_completion_rate = Event_info.objects.filter(organization_id=org_id)\
                .annotate(completion_rate=ExpressionWrapper(Sum(F('ticket_info__ticket_amount') - F('ticket_info__ticket_remain')) / Sum('ticket_info__ticket_amount'), output_field=FloatField()))\
                .order_by('-completion_rate')

            events_data = [{'event_id': event.event_id, 'completion_rate': round(event.completion_rate * 1000, 2) if event.completion_rate else 0} for event in events_sorted_by_completion_rate]
            return Response(events_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Organizer ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['GET'])
    def events_by_total_sales(request):
        org_id = request.query_params.get('user_id', None)
        if org_id is not None:
            events_sorted_by_total_sales = Event_info.objects.filter(organization_id=org_id).annotate(
                total_sales=Sum(
                    ExpressionWrapper(
                        (F('ticket_info__ticket_amount') - F('ticket_info__ticket_remain')) * F('ticket_info__ticket_price'),
                        output_field=FloatField()
                    )
                )
            ).order_by('-total_sales')

            events_data = [
                {
                    'event_id': event.event_id,
                    'event_name': event.event_name,
                    'total_sales': round(event.total_sales, 2) if event.total_sales else 0.00  # 保证即使没有销售也显示0.00
                }
                for event in events_sorted_by_total_sales
            ]

            return Response(events_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Organizer ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['GET'])
    def event_details_by_id(request):
        event_id = request.query_params.get('event_id', None)
        if event_id is not None:
            try:
                event = Event_info.objects.get(event_id=event_id)
                tickets = Ticket_info.objects.filter(event=event).annotate(
                    sold_amount=ExpressionWrapper(
                        F('ticket_amount') - F('ticket_remain'),
                        output_field=FloatField()
                    ),
                    total_sales=ExpressionWrapper(
                        (F('ticket_amount') - F('ticket_remain')) * F('ticket_price'),
                        output_field=FloatField()
                    )
                ).aggregate(
                    total_sold=Sum('sold_amount'),
                    total_revenue=Sum('total_sales')
                )

                tickets_detail = Ticket_info.objects.filter(event=event).values(
                    'ticket_id', 'ticket_type','ticket_name'
                ).annotate(
                    sold_amount=Sum(F('ticket_amount') - F('ticket_remain')),
                    total_sales=Sum((F('ticket_amount') - F('ticket_remain')) * F('ticket_price'))
                )

                event_details = {
                    'event_id': event.event_id,
                    'event_type': event.event_type,
                    'tickets': list(tickets_detail),
                    'total_sold': tickets['total_sold'],
                    'total_revenue': tickets['total_revenue']
                }

                return Response(event_details, status=status.HTTP_200_OK)
            except Event_info.DoesNotExist:
                return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "EventId is required"}, status=status.HTTP_400_BAD_REQUEST)

    @api_view(['GET'])
    def get_customer_loyalty(request):  # Repeat purchase rate: Analyze how many of the customers who purchased tickets are repeat purchasers and identify loyal customer groups.
        org_id = request.query_params.get('user_id')

        if not org_id:
            return Response({"error": "Organizer ID is required"}, status=400)

        # Filter booking information for all events of this organizer
        reservations = Reservation.objects.filter(event__organization_id=org_id)

        # Count the number of reservations for each customer
        customer_purchases = reservations.values('customer').annotate(
            purchase_count=Count('reservation_id')
        ).order_by('-purchase_count')


        repeat_customers = customer_purchases.filter(purchase_count__gt=1)
        repeat_customer_count = repeat_customers.count()

        total_customers = Customer.objects.filter(reservation__event__organization_id=org_id).distinct().count()

        repeat_purchase_rate = (repeat_customer_count / total_customers) * 100 if total_customers else 0

        return Response({
            "total_customers": total_customers,
            "repeat_customer_count": repeat_customer_count,
            "repeat_purchase_rate": repeat_purchase_rate
        }, status=200)

    @api_view(['GET'])
    def get_participation_analysis(request):  # Engagement analysis: Use the average number of tickets sold per event to measure engagement and identify trends and patterns of high and low engagement
        org_id = request.query_params.get('user_id')

        if not org_id:
            return Response({"error": "Organizer ID is required"}, status=400)

        # Get all activities of this organizer
        events = Event_info.objects.filter(organization_id=org_id)

        # For each event, calculate the total number of votes sold (total votes minus remaining votes)
        participation_data = events.annotate(
            sold_tickets=Sum(F('ticket_info__ticket_amount') - F('ticket_info__ticket_remain'))
        )

        # Calculate the average number of tickets sold across all activities
        average_participation = participation_data.aggregate(
            Avg('sold_tickets')
        )

        return Response({
            "average_participation": average_participation
        }, status=200)

    @api_view(['GET'])
    def get_annual_ticket_sales(request):  # Get the total revenue from ticket sales based on time
        org_id = request.query_params.get('user_id', None)
        time_frame = request.query_params.get('time_frame', 'monthly')

        if not org_id:
            return Response({"error": "Organizer ID is required"}, status=400)


        events = Event_info.objects.filter(organization_id=org_id)


        tickets = Ticket_info.objects.filter(event__in=events)

        if time_frame == 'monthly':
            data = tickets.annotate(month=TruncMonth('event__event_date')) \
                .values('month') \
                .annotate(total_tickets=Sum('ticket_amount'), total_income=Sum('ticket_price'))
        elif time_frame == 'quarterly':
            data = tickets.annotate(quarter=TruncQuarter('event__event_date')) \
                .values('quarter') \
                .annotate(total_tickets=Sum('ticket_amount'), total_income=Sum('ticket_price'))
        else:
            return Response({"error": "Invalid timeframe specified"}, status=400)

        return Response(data, status=200)

    @api_view(['GET'])
    def get_event_type_distribution(request):  # Show the distribution of activity types and analyze which types of activities are the most popular, sell the most tickets, and generate the highest revenue
        org_id = request.query_params.get('user_id', None)

        if not org_id:
            return Response({"error": "Organizer ID is required"}, status=400)


        event_data = Event_info.objects.filter(organization_id=org_id) \
            .values('event_type') \
            .annotate(total_events=Count('event_id'),
                      total_tickets_sold=Sum('ticket_info__ticket_amount'),
                      total_income=Sum('ticket_info__ticket_price'))


        for event_type in event_data:
            event_type['total_tickets_sold'] = event_type['total_tickets_sold'] or 0
            event_type['total_income'] = event_type['total_income'] or 0


        if event_data:
            most_popular_type = max(event_data, key=lambda x: x['total_tickets_sold'])
            highest_earning_type = max(event_data, key=lambda x: x['total_income'])
            response_data = {
                "event_types": list(event_data),
                "most_popular_type": most_popular_type,
                "highest_earning_type": highest_earning_type
            }
        else:
            response_data = {
                "message": "No event data available for the given organizer"
            }

        return Response(response_data, status=200)

    @api_view(['GET'])
    def get_ticket_price_analysis(request):  # Fare Analysis: Evaluate campaign performance across different fare ranges and identify the most popular and profitable fare ranges.
        org_id = request.query_params.get('user_id', None)

        if not org_id:
            return Response({"error": "Organizer ID is required"}, status=400)

        # Group tickets under each activity type and aggregate sales and revenue
        ticket_performance_data = Ticket_info.objects.filter(
            event__organization_id=org_id
        ).values(
            'ticket_type', 'event__event_type'
        ).annotate(
            total_sold=Sum('ticket_amount') - Sum('ticket_remain'),
            total_income=Sum('ticket_price', field='(ticket_amount-ticket_remain) * ticket_price')
        ).order_by('event__event_type', '-total_sold')

        # Construct fare performance data for each activity type
        event_type_performance = {}
        for data in ticket_performance_data:
            event_type = data['event__event_type']
            if event_type not in event_type_performance:
                event_type_performance[event_type] = {
                    'most_popular_ticket_type': data['ticket_type'],
                    'highest_grossing_ticket_type': data['ticket_type'],
                    'most_tickets_sold': data['total_sold'],
                    'highest_gross_income': data['total_income']
                }
            else:
                if data['total_sold'] > event_type_performance[event_type]['most_tickets_sold']:
                    event_type_performance[event_type]['most_popular_ticket_type'] = data['ticket_type']
                    event_type_performance[event_type]['most_tickets_sold'] = data['total_sold']

                if data['total_income'] > event_type_performance[event_type]['highest_gross_income']:
                    event_type_performance[event_type]['highest_grossing_ticket_type'] = data['ticket_type']
                    event_type_performance[event_type]['highest_gross_income'] = data['total_income']

        return Response({
            "event_type_performance": event_type_performance
        }, status=200)



class EventPage:
    '''
         Currently bode json
         '''
    @api_view(['POST'])
    def like_Comment(request):
        comment_id = request.query_params.get('comment_id')
        cus_id = request.query_params.get('cus_id')
        if comment_id:
            Comment = get_object_or_404(Comment_cus, pk=comment_id)
            customer = Customer.objects.filter(cus_id = cus_id).first()
            Comment.likes += 1  # Increase the number of likes
            Comment.save()  ## save Changes
            likecheck = LikeCheck(
                customer = customer,
                comment = Comment,
                created_at = timezone.now().replace(second=0, microsecond=0),
            )
            likecheck.save()
            return Response({'message': 'Comment liked successfully', 'total_likes': Comment.likes})
        else:
            return Response({'error': 'Comment ID is required'}, status=400)
    
    @api_view(['GET'])
    def like_checking(request):
        '''
         Function: Check whether a customer has liked it
         Pass in parameters: cus_id and comment_id

         Outgoing parameters: code
             1: No likes, but likes are allowed
             2: I have liked it before and cannot like it again.
             3: The customer or comment cannot be found
                 '''
        cus_id = request.query_params.get('cus_id', None)
        comment_id = request.query_params.get('comment_id', None)
        try:
            customer = Customer.objects.filter(cus_id = cus_id).first()
            comment = Comment_cus.objects.filter(comment_id = comment_id).first()

        except Customer.DoesNotExist:
            return JsonResponse({'code': '3', 'message': 'Customer not found.'}, status = 200)
        except Comment_cus.DoesNotExist:
            return JsonResponse({'code': '3', 'message': 'Comment not found.'}, status = 200)

        if LikeCheck.objects.filter(customer=customer, comment=comment).count() != 0:
            return JsonResponse({'code': '2', 'message': 'You have already liked this comment.'}, status=200)

        return JsonResponse({'code': '1', 'message': 'There is no like.'}, status=200)

    
    @api_view(['GET'])
    def like_number_check(request):
        comment_id = request.query_params.get('comment_id', None)
        comment = get_object_or_404(Comment_cus, comment_id=comment_id)
        return Response({'code':'1','message':'We find the comment and comment like', 'token' : comment.likes}, status = 200)