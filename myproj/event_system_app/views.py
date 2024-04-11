import random
import string
from django.core.cache import cache
from django.core.mail import send_mail, send_mass_mail
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from collections import defaultdict
from rest_framework.decorators import api_view, permission_classes
from .serializer import *
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from .models import *
from django.db import transaction
<<<<<<< HEAD
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
import json

from django.conf import settings

from django.contrib.auth.hashers import make_password, check_password

=======
import json
import numpy as np
from sklearn.metrics import jaccard_score
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
>>>>>>> origin/LZY——New
import requests

organizer_list = ['org_id', 'org_email', 'org_password', 'company_name', 'company_address', 'org_phone']

customer_list = ['cus_id', 'cus_name', 'cus_email', 'gender', 'prefer_type', 'cus_password', 'bill_address', 'cus_phone']

event_info_list = ['event_id', 'event_name', 'event_date', 'event_description', 'event_address', 'event_type']

<<<<<<< HEAD
def data_match(fields_list, input_data): #这个用于将从数据库查询到的数据，和模型匹配成字典
    return {field: getattr(input_data, field, None) for field in fields_list if hasattr(input_data, field)}

# 演出方修改了关键演出信息后，发送邮件的功能
def event_update_email(event_id, fields):
=======

def data_match(fields_list, input_data): #这个用于将从数据库查询到的数据，和模型匹配成字典
    return {field: getattr(input_data, field, None) for field in fields_list if hasattr(input_data, field)}


def event_update_email(event_id, fields): # 演出方修改了关键演出信息后，发送邮件的功能
>>>>>>> origin/LZY——New
    event = get_object_or_404(Event_info, pk = event_id)
    reservations = Reservation.objects.filter(event = event)
    customer_emails = [reservation.customer.cus_email for reservation in reservations]

    email_subject = 'Event Information Updated'
    email_message = f'The following event information has been updated: {", ".join(fields)}.'
    from_email = settings.EMAIL_HOST_USER

    # 创建邮件数据元组列表
    emails = [(email_subject, email_message, from_email, [email]) for email in customer_emails]

    # 批量发送邮件
    send_mass_mail(tuple(emails), fail_silently = False)
    return


<<<<<<< HEAD
=======
# 将标签集合转换为向量
def tags_to_vector(tags, all_tags):
    return np.array([int(tag in tags) for tag in all_tags])


def jaccard_sim(customer_tags, event_tags):
    '''
    customer_tags: 消费者喜欢的tags,
    event_tags: 数据库内所有event的tags列表集合

    :param customer_tags: 消费者喜欢的tags, 列表烈性
    :param event_tags: 各个event的tag，字典类型，id:tags
    :return: 评分字典，字典格式为 id:score
    '''

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

>>>>>>> origin/LZY——New
'''
200: 数据返回成功
400:数据错误或返回的数据格式错误
405:请求的方法错误

code:1代表成功, 2代表失败, 3代表非法数据, 4代表调用失败
'''

# MainPage功能
    # 1) 按照时间和类型的筛选功能
    # 2) 关键词搜索功能
class MainPage:
    @api_view(['GET']) #时间和类型筛选功能
    def mainpage_filter_events(request): #测试完成
        '''
        mainpage界面, 用户要选择两种类型，第一种是演出类型，第二种时间类型。该函数根据用户的选择，返回筛选后的演出
        :param request: 无
<<<<<<< HEAD
        :return: 'event_id', 'event_name', 'event_date', 'event_description', 'event_address', 'event_type'
        '''

        # 获取查询参数
        # event_type = request.GET.get('event_type', None)  # 演出类型，如'opera', 'concert'等
        # time_filter = request.GET.get('time_filter', None)  # 时间过滤条件，如'today', 'this_month', 'next_month'

        event_type_list = ['concert', 'live', 'comedy', 'opera']

        # print(event_type)
        # print(time_filter)
        # 获取当前时间
        now = timezone.now()

        # 基础查询集
        queryset = Event_info.objects.filter(event_date__gt=now)
        # print("first")
        # print(queryset)
        # print()

        # 根据演出类型过滤(一期代码)
        # if event_type in event_type_list:
        #     queryset = queryset.filter(event_type = event_type)
        # else:
        #     queryset = queryset.filter(event_type__in = event_type_list)

        queryset = queryset.filter(event_type__in=event_type_list)

        # 根据时间过滤条件进一步过滤(一期代码)
        # if time_filter == 'today':
        #     queryset = queryset.filter(event_date__year=now.year, event_date__month=now.month, event_date__day=now.day)
        #     # print("third")
        #     # print(queryset)
        #     # print()
        # elif time_filter == 'this_month':
        #     # print("fourth")
        #     # print(queryset)
        #     # print()
        #     queryset = queryset.filter(event_date__year=now.year, event_date__month=now.month)
        # elif time_filter == 'next_month':
        #     # print("fifth")
        #     # print(queryset)
        #     # print()
        #     next_month = now.month + 1 if now.month < 12 else 1
        #     year = now.year if now.month < 12 else now.year + 1
        #     queryset = queryset.filter(event_date__year=year, event_date__month=next_month)
        # else:
        #     queryset = queryset
        #
        # queryset = queryset

        # 将查询结果序列化为JSON
        events = list(
            queryset.values('event_id', 'event_name', 'event_date', 'event_description', 'event_address', 'event_type'))

        # print(events)
=======
        :return: 列表类型，列表元素为字典，字典内包含
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

>>>>>>> origin/LZY——New
        events = list(Event_info.objects.all().values('event_id', 'event_name', 'event_date', 'event_type'))
        empty_dict = []
        for i in events:
            filtered_event_data = {key: i[key] for key in ["event_name", "event_type", 'event_id', 'event_date']}
            empty_dict.append(filtered_event_data)

<<<<<<< HEAD

        # print(events)
        # return Response({"message":"000"})
=======
>>>>>>> origin/LZY——New
        return JsonResponse(empty_dict, safe = False, status = 200)

    '''
    搜索功能：还没编写
    '''
    @api_view(['POST']) # 还没编写
    def searching(request):
        pass


<<<<<<< HEAD
# Customer Account Order()
#    1)获取该消费者订购的演出当中，还未开始的演出信息
#    2)获取该消费者订购的演出当中，已经结束的演出信息
#    3)获取消费者订购的演出当中，被消费者取消的演出



class CusAccountFunction:
    @api_view(['GET']) #测试完成
    def upcoming_and_past(request):
        if request.method == 'GET':
=======
# CustomerFunction
#   1)用户订购了票的演出
#   2)用户取消了票的演出
#   3)显示一个用户的购票的详细信息
class CusAccountFunction:
    @api_view(['GET']) #测试完成
    def upcoming_and_past(request):
        '''
        函数功能：根据userid返回这个人的所有订购的演出
        接收参数： 从url当中获取user_id
        :return:列表，列表内参数为字典，字典格式如下
            {
                'event_id':
                'event_name':
                'event_date':
                'event_address':
            }
            附：Nicole说过，这里传入的user_id一定是customer身份，此处不再做身份判定
        '''
        if request.method == 'GET':

>>>>>>> origin/LZY——New
            cus_id = request.query_params.get('user_id', None)
            if cus_id is None:
                return Response({'code':'3','message':'there is something wrong with the input data'}, status = 404)
            # cus_id = data['user_id']
            customer = Customer.objects.filter(cus_id = cus_id).first()

            reservations = Reservation.objects.filter(customer=customer).select_related('event', 'ticket')
        
        # 初始化一个字典来存储演出信息和票务信息
        events_info = []
        
        # 遍历所有预订记录
        for reservation in reservations:
            event = reservation.event
            events_info.append({
                'event_id': event.event_id,
                'event_name': event.event_name,
                'event_date': event.event_date,
                'event_address': event.event_address,
            })
        
<<<<<<< HEAD
        return Response({'code':'1','message':'successful from getting values', 'token':events_info}, status = 200)
    
    
    @api_view(['GET'])
    def canceled_events(request): #测试完成
=======
        return Response({
            'code':'1',
            'message':'successful from getting values',
            'token':events_info
            }, status = 200)
    
    @api_view(['GET'])
    def canceled_events(request): #测试完成
        '''
        接收：user_id，一定为customer类型。从url当中获取
        :return: 字典，取消的票务信息
            {
            'event_id':
            'event_name':
            'event_date':
            'event_address':
                        }
        '''
>>>>>>> origin/LZY——New
        if request.method == 'GET':
        # 从请求体中提取数据
            user_id = request.query_params.get('user_id', None)  # 使用get避免KeyError异常
            
            # 使用filter().first()可以在未找到匹配项时返回None
            user = Customer.objects.filter(cus_id=user_id).first()
            
            # 如果找不到用户，返回错误响应
            if not user:
                return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
            
            # 查找该用户的所有退票记录
            cancellations = Cancel.objects.filter(customer=user).select_related('event', 'ticket')
            
            # 初始化一个列表来存储退票信息
            cancellations_info = {}
            
            # 遍历所有退票记录
            for cancellation in cancellations:
                event = cancellation.event
                # ticket = cancellation.ticket
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
<<<<<<< HEAD
        return Response({'code': '4', 'message': 'You have to use GET method'}, status = 405)

    @api_view(['GET'])
    def event_ticket(request):
=======

        return Response({
            'code': '4',
            'message': 'You have to use GET method'
        }, status = 405)

    @api_view(['GET'])
    def event_ticket(request): #测试完成
        '''
        查看，这个观众订购一个演出的订票信息
        接收参数：
            user_id: 消费者的id，url当中获取（一定是消费者）
            event_id: 演出的id，url当中获取
        :return:
            列表，列表元素为字典，字典格式如下
            {
            'reservation_id': reservation.reservation_id,
            'ticket_name': ticket.ticket_name,
            'ticket_type': ticket.ticket_type,
            'reserve_seat':reservation.reserve_seat,
            'amount': reservation.amount,
            'ticket_price': ticket.ticket_price,
            }
        '''

>>>>>>> origin/LZY——New
        if request.method == 'GET':
            user_id = request.query_params.get('user_id', None)  # 使用get避免KeyError异常
            event_id = request.query_params.get('event_id', None)  # 使用get避免KeyError异常
            
            # print("come here 1")
            customer = Customer.objects.filter(cus_id = user_id).first()
            event = Event_info.objects.filter(event_id = event_id).first()
<<<<<<< HEAD

            # print(customer)
            # print(event)

            # print("come here 2")

            reservations = Reservation.objects.filter(customer=customer, event=event).all()
            # print("come here 3")

            print(reservations)
=======
            # print("come here 2")

            reservations = Reservation.objects.filter(customer=customer, event=event).all()

            if reservations:
                return Response({
                    'code': '2',
                    'message': 'No data here',
                }, status=404)
>>>>>>> origin/LZY——New

            # reservations_info = {}
            reservations_info = []

            for reservation in reservations:
                ticket = reservation.ticket
<<<<<<< HEAD
                # reservations_info['reservation_id']({
                #     'ticket_name': ticket.ticket_name,
                #     'ticket_type': ticket.ticket_type,
                #     'amount': reservation.amount,
                #     'ticket_price': ticket.ticket_price,
                # })
=======
>>>>>>> origin/LZY——New
                reservations_info.append({
                'reservation_id': reservation.reservation_id,  # 假设预订模型的主键是id
                'ticket_name': ticket.ticket_name,
                'ticket_type': ticket.ticket_type,
                'reserve_seat':reservation.reserve_seat,
                'amount': reservation.amount,
                'ticket_price': ticket.ticket_price,
            })
<<<<<<< HEAD
            return Response({'code':'1','message':'successfully finding the data', 'token':reservations_info}, status = 200)

        return Response({'code': '4', 'message': 'You have to use GET method'}, status = 405)


=======
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
    def event_recommend(request): #测试完成
        '''
        推荐演出功能，利用jaccard相似度
        接收参数： user_id, 限定一定是customer的id。从url当中获取
        :return: 数据库内的所有数据的event，按照得分顺序排列。列表，列表元素为字典，格式如下
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
            all_events = Event_info.objects.all()

            event_list = []

            if customer is None: #找不到人的话
                return Response({
                    'code':'2', 
                    'message':'We can not find the customer'
                },  status = 400)
            
            if customer.prefer_tags is None: #如果这个人没有写tag
                if customer.prefer_type: #如果这个人写了喜欢什么类型的演出
                    special_type_events = Event_info.objects.filter(event_type = customer.prefer_type).all()
                    not_special_type_events = Event_info.objects.exclude(event_type=customer.prefer_type).all()
                    for single in special_type_events: #先招呼上
                        event_list.append(
                            {
                                'event_id':single.event_id,
                                'event_name':single.event_name,
                                'event_date':single.event_date,
                                'address':single.event_address
                            }
                        )
                    for single in not_special_type_events:
                        event_list.append(
                            {
                                'event_id':single.event_id,
                                'event_name':single.event_name,
                                'event_date':single.event_date,
                                'address':single.event_address
                            }
                        )
                else: # 如果这个人也没有写自己喜欢什么类型的演出，那直接把数据库的演出直接招呼上去
                    for single in all_events:
                        event_list.append(
                            {
                                'event_id':single.event_id,
                                'event_name':single.event_name,
                                'event_date':single.event_date,
                                'address':single.event_address
                            }
                        )    
            else: # 如果这个人写了tag，那就能去做推荐
                event_tags_dict = {}
                empty_list = []

                for event in all_events:
                    if event.event_tags is None:
                        empty_list.append(event.event_id)
                    else:
                        event_tags_dict[event.event_id] = event.event_tags

                if event_tags_dict: # 只有里面有东西，我们才开始用jaccard算法
                    result = jaccard_sim(customer.prefer_tags, event_tags_dict)

                for event in empty_list: #把tag是none的演出的得分设置为0，加入其中
                    result[event] = 0
                
                sorted_dict = dict(sorted(result.items(), key=lambda item: item[1], reverse=True))

                keys_in_order = list(sorted_dict.keys())

                for single_keys in keys_in_order:
                    event_list.append(Event_info.objects.filter(event_id = single_keys).
                                    values('event_id', 'event_name', 'event_date', 'event_address').first())
            return Response({
                'code':'1', 
                'message':'successfully jaccard',
                'token':event_list
                }, status = 200)
        
        return Response({
            'code':'4', 
            'message':'The function is not right', 
            }, status = 400)
    
>>>>>>> origin/LZY——New

# LoginPage
#   1)发送验证码功能
#   2)重置密码功能
#   3)用户登录功能
#   4)用户注册功能
class LoginPage:
    @api_view(['POST']) # 测试完成
    def send_reset_code(request):
<<<<<<< HEAD
        email = request.data.get('email')
        if not email:
            return JsonResponse({'error': 'Email is required'}, status = 400)
        customer = Customer.objects.filter(cus_email = email).first()
        organizer = Organizer.objects.filter(org_email = email).first()
        if customer is None and organizer is None:
            return JsonResponse({'error': 'Email does not exist'}, status = 400)
=======
        '''
        发送验证码功能，
        接收参数：email，从发送表单当中获取
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
>>>>>>> origin/LZY——New
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
        cache.set(f'password_reset_code_{email}', code, timeout = 60)
        
        send_mail(
            'Your Password Reset Code',
            f'Your password reset code is: {code}',
            '2545322339@foxmail.com',  # 发件人
            [email],  # 收件人列表
            fail_silently=False,
        )
<<<<<<< HEAD
        return JsonResponse({'message': 'Verification code sent successfully'})

    @api_view(['POST']) # 测试完成
    def reset_password(request):
=======
        return Response({
            'code':'1',
            'message': 'Verification code sent successfully'
        },status = 200)

    @api_view(['POST']) # 测试完成
    def reset_password(request):
        '''
        验证验证码的正确与重新修改密码
        接收数据：
            email：邮箱
            code：验证码
            new_password：新密码
            全部从提交的表单当中获取
        :return:
        '''
>>>>>>> origin/LZY——New
        email = request.data.get('email')
        code = request.data.get('code')
        new_password = request.data.get('newPassword')

        if not all([email, code, new_password]):
<<<<<<< HEAD
            return JsonResponse({'error': 'Missing parameters'}, status = 400)
        
        cached_code = cache.get(f'password_reset_code_{email}')
        # print(cached_code)
=======
            return Response({
                'code':'3',
                'error': 'Missing parameters'
            }, status = 400)
        
        cached_code = cache.get(f'password_reset_code_{email}')

>>>>>>> origin/LZY——New
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
<<<<<<< HEAD
        return JsonResponse({'message': 'Password has been reset successfully'})
=======
        return Response({
            'code':'1',
            'message': 'Password has been reset successfully'
        },status = 200)
>>>>>>> origin/LZY——New

    @csrf_exempt
    @api_view(['POST']) # 测试完成
    def user_login(request):
        '''
<<<<<<< HEAD
        前端的登录页面，从前端获取数据，并判断是否正确
=======
        前端的登录页面，从前端表单获取数据，并判断是否正确
        接收参数：
            email:
            password:
>>>>>>> origin/LZY——New

        返回类型：
        message：登录成功或登录失败的字符串
        code:1代表成功, 2代表失败, 3代表非法数据, 4代表调用失败
        user_id:只有在登录成功的时候才有，失败的时候没有。成功的时候返回的事这个人在数据库的id
        '''
<<<<<<< HEAD
        # print("aaaaaa")
        # print(request.method)
=======
>>>>>>> origin/LZY——New
        print(request.method == 'POST')
        if request.method == 'POST':
            # print("ggggg")
            try:
                # print("comer here 1")
                data = json.loads(request.body)
                email = data['email']
                password = data['password']
                # print("comer here 2")
                customer_data = Customer.objects.filter(cus_email = email).first()  # 正式代码
                customer = data_match(customer_list, customer_data)
                # print("comer here 3")
                if customer:  # 能找到这个customer
                    # print("comer here 4")
                    if check_password(password, customer['cus_password']):
                        # print("comer here 5")
                    # if customer['cus_password'] == password:
                        # return Response({'code': 1, 'message': 'login success',"user_type": "customer", "token": [customer['cus_id'], customer['cus_name'], customer['cus_email']]}, status = 200) #NICOCE测试用
                        return Response({'code': 1, 'message': 'login success', "user_type": "customer",
                                         "token": customer['cus_id']},
                                        status=200) # LSL测试用
                    else:
                        # print("comer here 6")
                        return Response({'code': '2', 'message': 'login failed, please check email/password',"user_type": None}, status = 400)
                        
                else:  # 有可能这个人是个organizer
                    # print("comer here 7")
                    organizer_data = Organizer.objects.filter(org_email=email).first()  # 正式代码
                    # print(organizer_data.org_email)
                    organizer = data_match(organizer_list, organizer_data)
                    if organizer:
                        # if organizer['org_password'] == data['password']:  # 说明匹配上了
                        # print("comer here 8")
                        if check_password(password, organizer['org_password']):
                            # print("comer here 9")
                            # return Response({'code': '1', 'message': 'login success', "user_type": "organizer", "token": [organizer['org_id'], organizer['org_email'], organizer['company_name']]}, status = 200) #Nicole测试用
                            return Response({'code': '1', 'message': 'login success', "user_type": "organizer",
                                            "token": organizer['org_id']}, status=200) # LSL测试用
                        else:  # 说明密码或者其他的东西出现了错误
                            # print("comer here 10")
                            return Response({'code': '2', 'message': 'login failed, please check email/password',"user_type": None }, status = 400)
                        
                    return Response({'code': '2', 'message': 'login failed, please check email/password',"user_type": None }, status = 400)
                        
            except json.JSONDecodeError:
                # print("comer here 11")
                return Response({'code': '1', 'message': 'Invalid json data'}, status = 400)

        # print("comer here 12")
        return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)

    @api_view(['POST']) # 测试完成
    def register(request):
        """
<<<<<<< HEAD
        前端的这侧页面，从前端获取数据，并判断是否正确

=======
        从前端获取表单数据
>>>>>>> origin/LZY——New
        返回类型：
        message：登录成功或登录失败的字符串
        code:1代表成功, 2代表失败, 3代表非法数据, 4代表调用失败
        token:只有在登录成功的时候才有，失败的时候没有。成功的时候返回的是这个人在数据库的id
        """
        if request.method == 'POST':
            # 这个是人为创造的数据，cus数据和org数据，后面得删了
            try:
                data = json.loads(request.body)
<<<<<<< HEAD
                # print(data)
                # print(data['role'])
                # print(data)
                # return Response("successful")
=======

>>>>>>> origin/LZY——New
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
<<<<<<< HEAD
                    # print("heyheyhey")

                    # print("suprise")
                    if existing_organizer or existing_customer:  # 检查数据库内是否存在相同的人
                        return Response({'message': 'email already registered'}, status=400)
                    else:
                        # encrypted_password = make_password(password)
=======
                    if existing_organizer or existing_customer:  # 检查数据库内是否存在相同的人
                        return Response({'message': 'email already registered'}, status=400)
                    else:
>>>>>>> origin/LZY——New
                        new_organizer = Organizer(
                            org_id = Organizer.objects.count() + 1,
                            company_name = organization_name,
                            company_address = organization_address,
                            
                            org_email = email,
                            org_password = make_password(password),
                            org_phone = phone
                        )
                        new_organizer.save()
                        # response的内容都要修改一下，这个函数内的所有response
<<<<<<< HEAD
                    return Response({'code': '1', 'message': 'JSON data received and processed successfully',"token":new_organizer.org_id}, status = 200)
                    # return Response({'code': '0', 'message': 'JSON data received and processed successfully'})

                elif data['role'] == 'customer':
                    if existing_customer or existing_organizer:  # 检查数据库内是否存在相同的人
                        return Response({'code': '2', 'message': 'email already registered'}, status = 400)
=======
                    return Response({
                        'code': '1',
                        'message': 'JSON data received and processed successfully',
                        "token":new_organizer.org_id}, 
                    status = 200)

                elif data['role'] == 'customer':
                    if existing_customer or existing_organizer:  # 检查数据库内是否存在相同的人
                        return Response({
                            'code': '2', 
                            'message': 'email already registered'}, 
                        status = 400)
>>>>>>> origin/LZY——New
                    else:
                        # encrypted_password = make_password(password)
                        new_customer = Customer(
                            cus_name = username,
                            bill_address = bill_address,
                            cus_email = email,
                            cus_password = make_password(password),
                            cus_phone = phone,
<<<<<<< HEAD
                            gender = None,
                            prefer_type = None
=======
                            gender = data['gender'] if data['gender'] else None,
                            prefer_type = data['prefer_type'] if data['prefer_type'] else None,
                            prefer_tags = data['prefer_tags'] if data['prefer_tags'] else None
>>>>>>> origin/LZY——New
                        )
                        new_customer.save()

                    # 第一种方式
<<<<<<< HEAD
                    return Response({'code': '1', 'message': 'JSON data received and processed successfully', 'token':new_customer.cus_id}, status = 200)

                    # 第二种方式
                        # 我估计会产生报错
                        # token, created = Token.objects.get_or_create(user = new_customer)
                        # return Response({'message': 'Customer registered successfully', 'token': token.key}, status = status.HTTP_201_CREATED)

                    # "token": new_customer.token})
                # return Response({"jjjjj"})
            except   json.JSONDecodeError:
                return Response({'code': '3', 'message': 'Invalid JSON data'}, status = 400)
=======
                    return Response({
                        'code': '1', 
                        'message': 'JSON data received and processed successfully', 
                        'token':new_customer.cus_id}, 
                    status = 200)
            except   json.JSONDecodeError:
                return Response({
                    'code': '3',
                    'message': 'Invalid JSON data'}, 
                status = 400)
>>>>>>> origin/LZY——New
        else:
            return Response({'code': '4', 'message': 'This view only accepts POST requests'}, status = 405)


# User Account Page
#   1) 消费者个人信息展示
#   2) 组织者个人信息展示
#   3) 编辑消费者个人信息编辑保存
#   4) 组织者个人信息编辑保存
class AccountInfoPage:
    @api_view(['GET']) # 测验完成
    def cus_info_show(request, user_id):
<<<<<<< HEAD
        user_id = 1
=======
        '''
        展示这个人的个人信息，

        :param user_id:
        :return:
        '''

>>>>>>> origin/LZY——New
        if request.method == 'GET':
            customer = Customer.objects.filter(cus_id = user_id).first()
            if customer:
                customer = data_match(customer_list, customer)
                customer['age_area'] = None
                return JsonResponse(customer, status = 200)
                # 找到数据了，成功返回
            else:
                # account页面发来请求消费者个人信息，但是查无此人，基本不太可能，但还是写上这个功能
<<<<<<< HEAD
                return Response({'code': '4', 'message': 'This customer is not exist, you can not enter in account page'}, status = 404)
        else:
            return Response({'code': '4', 'message': 'This function only accepts GET data'}, status = 405)
=======
                return Response({
                    'code': '4',
                    'message': 'This customer is not exist, you can not enter in account page'
                }, status = 404)
        else:
            return Response({
                'code': '4',
                'message': 'This function only accepts GET data'
            }, status = 405)
>>>>>>> origin/LZY——New


    @api_view(['GET']) # 测验完成
    def org_info_show(request, user_id):
        '''
<<<<<<< HEAD
        这个函数是用来导航到account页面, 返回 customer 的个人用户信息的
        '''
        if request.method == 'GET':
            # print(user_id)
            organizer = Organizer.objects.filter(org_id = user_id).first()
            if organizer:
                organizer = data_match(organizer_list, organizer)
                organizer['age_area'] = None        
                return JsonResponse({'code': 1, 'message': 'login success',"user_type": "organizer", "token": organizer}, status = 200)
                # 找到数据了，成功返回
            else:
                # account页面发来请求消费者个人信息，但是查无此人，基本不太可能，但还是写上这个功能
                return Response({'code': '4', 'message': 'This organizer is not exist, you can not enter in account page'}, status = 404)
        else:
            return Response({'code': '4', 'message': 'This function only accepts GET data'}, status = 405)


    @api_view(['POST']) # 测验完成
    def edit_cus_info(request):
=======
        这个函数是用来导航到account页面, 返回 organizer 的个人用户信息的
        接收参数 user_id 从url当中获取
        返回：organizer整个类型
        (可能存在一个bug，即前端无法解析query类型的数据)
        '''
        if request.method == 'GET':
            organizer = Organizer.objects.filter(org_id = user_id).first()
            if organizer:
                organizer = data_match(organizer_list, organizer)
                return Response({
                    'code': 1,
                    'message': 'login success',
                    "user_type": "organizer",
                    "token": organizer
                }, status = 200)
                # 找到数据了，成功返回
            else:
                # account页面发来请求消费者个人信息，但是查无此人，基本不太可能，但还是写上这个功能
                return Response({
                    'code': '2',
                    'message': 'This organizer is not exist, you can not enter in account page'
                }, status = 404)
        else:
            return Response({
                'code': '4',
                'message': 'This function only accepts GET data'
            }, status = 405)


    @api_view(['PUT']) # 测验完成
    def edit_cus_info(request):
        '''
        修改数据cus的个人数据
        接收参数，cus页面的全部参数
        接收参数格式：
            json的字典数据
            customer['cus_name'] = data['name']
            customer['cus_email'] = data['email']
            customer['gender'] = data['gender']
            customer['bill_address'] = data['bill_address']
            customer['cus_phone'] = data['phone']
            customer['prefer_tags'] = data['prefer_tags']
        :return: code 和 message
        '''
>>>>>>> origin/LZY——New
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
            except Exception as e:
<<<<<<< HEAD
                return Response({'code': '3', 'message': 'Invalid json data'}, status = 200)
=======
                return Response({
                    'code': '3', 'message': 'Invalid json data'
                }, status = 200)
>>>>>>> origin/LZY——New
            customer = Customer.objects.filter(cus_id = data['id']).first()
            customer = data_match(customer_list, customer)
            if customer['cus_email'] != data['email']:
                organizer = Organizer.objects.filter(org_email = data['email']).first()
                new_customer = Customer.objects.filter(cus_email = data['email']).first()
                if new_customer or organizer:
<<<<<<< HEAD
                    return Response({'code':'2', "message":'The email is already exist'}, status = 200)
=======
                    return Response({
                        'code':'2',
                        "message":'The email is already exist'
                    }, status = 200)
>>>>>>> origin/LZY——New

            customer['cus_name'] = data['name']
            customer['cus_email'] = data['email']
            customer['gender'] = data['gender']
            customer['bill_address'] = data['bill_address']
            customer['cus_phone'] = data['phone']
<<<<<<< HEAD
            Customer(**customer).save()
            return Response({'code': '1','message':'Successful from saving data'}, status = 200)
        return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)


    @api_view(['POST']) # 测验完成
    def edit_org_info(request):
=======
            # customer['age_area'] = data['age_area']
            customer['prefer_tags'] = data['prefer_tags']
            Customer(**customer).save()
            return Response({
                'code': '1',
                'message':'Successful from saving data'
            }, status = 200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)


    @api_view(['PUT']) # 测验完成
    def edit_org_info(request):
        '''
        修改org账户的账户信息。从发送的表单当中接收数据
                      json的字典数据

            organizer['company_name'] = data['name']
            organizer['org_email'] = data['email']
            organizer['company_address'] = data['address']
            organizer['org_phone'] = data['phone']

        :return:
        '''
>>>>>>> origin/LZY——New
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
            except Exception as e:
<<<<<<< HEAD
                return Response({'code': '3', 'message': 'Invalid json data'}, status = 400)
=======
                return Response({
                    'code': '3',
                    'message': 'Invalid json data'
                }, status = 400)

>>>>>>> origin/LZY——New
            organizer = Organizer.objects.filter(org_id = data['id']).first()
            organizer = data_match(organizer_list, organizer)

            if organizer['org_email'] != data['email']:
                customer = Customer.objects.filter(cus_email = data['email']).first()
                new_organizer = Organizer.objects.filter(org_email = data['email']).first()
                if new_organizer or customer:
<<<<<<< HEAD
                    return Response({'code':'2', "message":'The email is already exist'}, status = 200)
                
=======
                    return Response({
                        'code':'2',
                        "message":'The email is already exist'
                    }, status = 200)

>>>>>>> origin/LZY——New
            organizer['company_name'] = data['name']
            organizer['org_email'] = data['email']
            organizer['company_address'] = data['address']
            organizer['org_phone'] = data['phone']
            Organizer(**organizer).save()
<<<<<<< HEAD
            return Response({'code': '1','message':'Successful from saving data'}, status = 200)
        return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)


# 创建演出的功能
class OrganizerFunctionPage:
    @api_view(['POST'])
    def event_create(request): # 测试完成
        if request.method == 'POST':
            # event_data = json.loads(request.body)

            try:
                # print(request.body)
                event_data = json.loads(request.body.decode('utf-8'))
                # print(event_data)
            except json.JSONDecodeError:
            #     # print("event_data)
            #     # print(type(event_data))
            #     # print(event_data)
                return Response({'code': '3', 'message': 'Invalid json data'}, status = 400)
            organizer = Organizer.objects.filter(org_id = event_data['org_id']).first()
=======
            return Response({
                'code': '1',
                'message':'Successful from saving data'
            }, status = 200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)


# 创建演出的功能
# 修改演出的功能
# 删除演出的功能
# 查询历史创建演出的功能
class OrganizerFunctionPage:
    @api_view(['POST'])
    def event_create(request): # 测试完成
        '''
        创建演出。从前端里面接收表单信息
            表单信息包括
            event_name = event_data['event_name'],
            event_date = event_data['event_date'],
            event_description = event_data['event_description'],
            event_address = event_data['event_address'],
            event_image_url = event_data['event_image_url'],  # 确保这里处理了图片的上传
            event_type = event_data['event_type'] , #event_type 必须要有类型，不能为空
            event_last_selling_date = event_data['event_last_selling_date'],
            event_tags = event_data['event_tags'] if event_data['event_tags'] else None,
            organization = organizer,  # 假设前端发送的是组织ID

        :return: code 与 message
        '''
        if request.method == 'POST':
            try:
                event_data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError:
                return Response({'code': '3', 'message': 'Invalid json data'}, status = 400)

            organizer = Organizer.objects.filter(org_id = event_data['org_id']).first()

>>>>>>> origin/LZY——New
            event = Event_info(
                event_name = event_data['event_name'],
                event_date = event_data['event_date'],
                event_description = event_data['event_description'],
                event_address = event_data['event_address'],
                event_image_url = event_data['event_image_url'],  # 确保这里处理了图片的上传
<<<<<<< HEAD
                event_type = event_data['event_type'],
                event_last_selling_date = event_data['event_last_selling_date'],
=======
                event_type = event_data['event_type'] , #event_type 必须要有类型，不能为空
                event_last_selling_date = event_data['event_last_selling_date'],
                event_tags = event_data['event_tags'] if event_data['event_tags'] else None,
>>>>>>> origin/LZY——New
                organization = organizer,  # 假设前端发送的是组织ID
            )
            event.save()  # 保存事件对象，这样它就有了一个ID
            for ticket in event_data['tickets']:
                ticket = Ticket_info(
                    ticket_type = ticket['ticket_type'],
                    ticket_name = "Reserve" + str(ticket['ticket_type']),
                    ticket_amount = ticket['ticket_amount'],
                    ticket_price = ticket['ticket_price'],
                    ticket_remain = ticket['ticket_amount'],
                    event = event  # 这里直接将前面创建的event对象作为外键
                )
                ticket.save()  # 保存票务对象
<<<<<<< HEAD
                return Response({"code":"1", "message":"Event successfully created"}, status = 200)

        return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)

    @api_view(['PUT'])
    def edit_event(request): #测试完成
=======
                return Response({
                    "code":"1",
                    "message":"Event successfully created"
                }, status = 200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)

    @api_view(['PUT'])
    def edit_event(request): #测试完成
        '''
        修改演出的信息。从前端接收表单信息

        :return: code 和 message
        '''
>>>>>>> origin/LZY——New
        if request.method == "PUT":
            try:
                updated_data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError:
                #     # print("event_data)
                #     # print(type(event_data))
                #     # print(event_data)
                return Response({'code': '3', 'message': 'Invalid json data'}, status = 400)
            event = Event_info.objects.get(event_id = updated_data['event_id'])

            no_need_check = ['event_description', 'event_image_url',]


            email_fields = ['event_name', 'event_date', 'event_description', 'event_address',
                        'event_type', 'event_last_selling_date']

            fields_changed = {}
            field_no_need_changed = []
            for field in email_fields:
                if field in updated_data and getattr(event, field) != updated_data[field]:
                    setattr(event, field, updated_data[field])
                    fields_changed[field] = updated_data

            for field in no_need_check:
                if field in updated_data and getattr(event, field) != updated_data[field]:
                    setattr(event, field, updated_data[field])
                    field_no_need_changed.append(field)

            if field_no_need_changed:
                if fields_changed:
                    event_update_email(event.event_id, fields_changed)
                event.save()
<<<<<<< HEAD
                return JsonResponse({'code':'1', 'message': 'Event updated and email sent'}, status = 200)
            else:
                return JsonResponse({'message': 'No changes detected'}, status = 200)

        return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)
    
    @api_view(['DELETE'])
    def delete_event(request):
=======
                return JsonResponse({
                    'code':'1',
                    'message': 'Event updated and email sent'
                }, status = 200)
            else:
                return JsonResponse({
                    'message': 'No changes detected'
                }, status = 200)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)
    
    @api_view(['DELETE'])
    def delete_event(request): 
>>>>>>> origin/LZY——New
        '''
        接受的数据格式为int
        是事件的event_id，foxapi的情况在body中定义
        失败会显示原因：1、找不到事件。2、事件id没有检查到。
        成功显示：删除事件成功。同时删除预定的记录，退款，和群发邮件。
        '''
        if request.method == "DELETE":
            event_id = request.data.get('event_id', None)  # Accessing the ID from request body
            if event_id is not None:
                try:
                    # 先收集预订了该事件的所有用户的邮箱地址
                    reservations = Reservation.objects.filter(event_id=event_id).select_related('customer')
                    recipients = [reservation.customer.cus_email for reservation in reservations if reservation.customer.cus_email]
                    
                    # 尝试找到事件并删除
                    event = Event_info.objects.get(event_id=event_id)
                    event_name = event.event_name  # 存储事件名称以用于邮件内容
                    event.delete()
                    
                    # 发送邮件通知
                    if recipients:  # 确保有收件人地址列表不为空
                        subject = "Event Cancellation Notice"
                        message = f"We regret to inform you that the event '{event_name}' you had reserved tickets for has been cancelled. We apologize for any inconvenience this may cause."
                        send_mail(
                            subject,
                            message,
                            '2545322339@foxmail.com',  # 替换为你的发送邮箱地址
                            recipients,
                            fail_silently=False,
                        )
                    
<<<<<<< HEAD
                    return Response({"code":"1", 'message': 'Event deleted successfully and email sent'}, status = 200)
                except Event_info.DoesNotExist:
                    return Response({"code":"4", 'error': 'Event not found'}, status=404)
            else:
                return Response({"code":"3", 'error': 'Event ID is required'}, status=403)

    @api_view(['GET'])
    def created_events(request):
        '''
=======
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
    def created_events(request): #测试完成
        '''
        这个函数使用来获取所有创建过的演出。
        传入user_id （一定是org的id）。从url当中传入
        return: 一个列表，列表内元素为字典，字典格式如下
            {
            'event_id',
            'event_name',
            'event_date',
            'event_address'
            }
>>>>>>> origin/LZY——New
        这里可能存在着一个隐患，即当异常演出是没有tickets信息是，可能会出现报错
        '''
        if request.method == 'GET':
            data = json.loads(request.body)
            org_id = data['user_id']# 获取指定的 Organizer

            organizer = Organizer.objects.get(org_id=org_id)
            if organizer is None:
<<<<<<< HEAD
                return Response({'code':'2','message':'failed from finding this organizer'}, status = 404)
=======
                return Response({
                    'code':'2',
                    'message':'failed from finding this organizer'
                }, status = 404)
>>>>>>> origin/LZY——New
            
            # 获取这个 Organizer 创建的所有 Event_info
            events = Event_info.objects.filter(organization=organizer).values(
                'event_id', 'event_name', 'event_date', 'event_address'
            )
            if events is None:
<<<<<<< HEAD
                return Response({'code':'2','message':'There  is no recorded data for this organizer'}, status = 404)
=======
                return Response({
                    'code':'2',
                    'message':'There is no recorded data for this organizer'
                }, status = 404)
>>>>>>> origin/LZY——New
            empty_list = []

            for event in events:

                event_infor = Event_info.objects.filter(event_id = event['event_id']).first()
                tickets = Ticket_info.objects.filter(event = event_infor).values(
                    'ticket_id', 'ticket_type', 'ticket_name', 'ticket_amount', 'ticket_price', 'ticket_remain'
                )
                event['tickets'] = tickets
                empty_list.append(event)

<<<<<<< HEAD
            return Response({'code':'1','message':'success get the past data', 'token':empty_list}, status = 200)
    
        return Response({'code':'4', 'message':'The method is not allowed'}, status = 405)
=======
            return Response({
                'code':'1',
                'message':'success get the past data',
                'token':empty_list
            }, status = 200)
    
        return Response({
            'code':'4',
            'message':'The method is not allowed'
        }, status = 405)
>>>>>>> origin/LZY——New


# Event detail page
#   1)演出信息展示功能
#   2)订票功能
#   3)评论功能
#   4)回复评论功能
#   5)点赞功能
class EventDetailPage:
    @api_view(['GET'])
    def get_event_detail(request): #测试完成
        '''
        获取演出详细信息的第一部分，获取演出详细信息，和评分
        :return: 返回一个字典，内含
            'id':
            'title'
            'date'
            'location'
            'description'
            'last_selling_date'
            'image': 这是个string类型
            'type':
            'total_rating':总评分,是个浮点数，范围是 0-5
            'tickets': 是个本场演出各类型剩余票量的字典
        '''
        if request.method == 'GET':
            event_id = request.query_params.get('event_id', None)
            if event_id:
                event = Event_info.objects.filter(event_id = event_id).first() # 先找到这个event
                ticket_set = Ticket_info.objects.filter(event = event).all() #查询这个演出的票的种类
                ticket_dict = {}
                for ticket in ticket_set:
<<<<<<< HEAD
                    ticket_dict[ticket.ticket_type] = ticket.ticket_remain
=======
                    ticket_dict[ticket.ticket_type] = [ticket.ticket_remain, ticket.ticket_price]
>>>>>>> origin/LZY——New
                cus_comments = Comment_cus.objects.filter(event = event).all()
                rate_num = 0
                total_rate = 0
                for single_comment in cus_comments:
                    if single_comment.event_rate is not None:
                        total_rate += single_comment.event_rate
                        rate_num += 1
                if total_rate > 0:
                    ave_rate = round(total_rate / rate_num, 1)

                    frontend_data = {
                        'id':event.event_id,
                        'title':event.event_name,
                        'date':event.event_date,
                        'location':event.event_address,
                        'description':event.event_description,
                        'last_selling_date':event.event_last_selling_date,
<<<<<<< HEAD
                        'image':event.event_image_url,
                        'type':event.event_type,
                        'total_rating':ave_rate,
                        'tickets':ticket_dict
                    }
                    return Response({'code':'1', 'message':'Successfuly fingding', "token":frontend_data}, status = 200)
            else:
                return Response({'code': '3', 'message': 'There is no event id in it'}, status = 400)
        return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)

    @api_view(['GET'])
    def get_comment(request): #测试完成
=======
                        'event_tags':event.event_tags,
                        'image':event.event_image_url,
                        'type':event.event_type,
                        'total_rating':ave_rate,
                        'tickets':ticket_dict,
                    }
                    return Response({
                        'code':'1',
                        'message':'Successfuly fingding', 
                        "token":frontend_data
                    }, status = 200)
            else:
                return Response({
                    'code': '3',
                    'message': 'There is no event id in it'
                }, status = 400)
        return Response({
            'code': '4', 
            'message': 'This function only accepts POST data'
        }, status = 405)

    @api_view(['GET'])
    def get_comment(request): #测试完成
        '''
        获取一个event底下的所有comment。传入为event_id, 从url内传入

        :return: 一个列表，列表元素为字典
        格式如下：
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
>>>>>>> origin/LZY——New
        if request.method =='GET':
            event_id = request.query_params.get('event_id', None)
            # print("come here 1")

            if event_id:
                comments_with_replies = []
                # print("come here 2")

                # 使用Prefetch优化查询，以避免N+1查询问题
                replies_prefetch = Prefetch('replies', queryset = Reply_org.objects.all(), to_attr = 'fetched_replies')

                # print("come here 3")
                # 查询指定演出的最新50条评论，包括预先获取的回复
                comments = Comment_cus.objects.filter(event_id=event_id).\
                               prefetch_related(replies_prefetch).\
                                    order_by('-comment_time')[:50]

                # print(comments)
                # print("come here 4")
                comments_with_replies = []

                # print("come here 5")
                for comment in comments:
                    comment_data = {
                        "comment_id": comment.comment_id,
                        "event_rate": comment.event_rate,
                        "comment": comment.comment_cus,
                        "comment_time": comment.comment_time,
                        "replies": []
                    }
                    # print("come here 6")

                    # 检查是否存在组织方的回复并添加到字典中
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
<<<<<<< HEAD
            return Response({"token":comments_with_replies}, status = 200)
=======
            return Response({
                "token":comments_with_replies
            }, status = 200)
>>>>>>> origin/LZY——New

        return Response({'code': '4', 'message': 'This function only accepts GET data'}, status = 405)

    @api_view(['POST'])
    def cus_make_comment(request): #测试完成
<<<<<<< HEAD
        print(request.method)
=======
        '''
        消费者做出评价
        从url内接收参数，event_id和cus_id。同时接收表单
        :return: code和message
        '''
        # print(request.method)
>>>>>>> origin/LZY——New
        if request.method == 'POST':
            # print("success")
            
            data = request.data
            # print("come here 1")

            event_id = request.query_params.get('event_id', None)
            cus_id = request.query_params.get('cus_id', None)

            event = Event_info.objects.filter(event_id = event_id).first()
            customer = Customer.objects.filter(cus_id = cus_id).first()
<<<<<<< HEAD

            # print(event_id)
            # print(cus_id)
            # print("come here 2")
            if event and customer:
                # print("come here 3")
                
                comment = Comment_cus.objects.filter(event = event, customer = customer).first()
                # print("come here 3")
                # if comment:
                #     print(comment.comment_cus)
                # print("come here 4")
                if comment:
                    return Response({'code':'2', 'message':'You have leave a comment before'}, status = 200)
=======
            # print("come here 2")
            if event and customer:
                # print("come here 3")
                comment = Comment_cus.objects.filter(event = event, customer = customer).first()
                # print("come here 3")
                if comment:
                    return Response({
                        'code':'2',
                        'message':'You have leave a comment before'
                    }, status = 200)
>>>>>>> origin/LZY——New
                if data:
                    # print("come here 7")
                    comment = Comment_cus(
                        event_rate = int(data['event_rate']),
                        comment_cus = data['comment_cus'],
                        comment_time = timezone.now().replace(second=0, microsecond=0),
                        comment_image_url = data['comment_image_url'] if 'comment_image_url' in data and data['comment_image_url'] else None,
                        event = event,
                        customer = customer,
                    )
                    comment.save()
                    # print("come here 8")
<<<<<<< HEAD
                    return Response({'code':'1', 'message':'successfuly submit the comment'}, status = 200)
                
                return Response({'code':'3', 'message':'The input data is not json form'}, status = 400)
            
            return Response({'code':'2', 'message':'We did not find the appropriate data'}, status = 404)

        return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)

    @api_view(['POST'])
    def org_make_reply(request):
=======
                    return Response({
                        'code':'1',
                        'message':'successfuly submit the comment'
                    }, status = 200)
                
                return Response({
                    'code':'3',
                    'message':'The input data is not json form'
                }, status = 400)
            
            return Response({
                'code':'2',
                'message':'We did not find the appropriate data'
            }, status = 404)

        return Response({
            'code': '4',
            'message': 'This function only accepts POST data'
        }, status = 405)

    @api_view(['POST'])
    def org_make_reply(request): #测试完成
        '''
        组织方进行回复评论功能。
        接收参数：user_id 和 comment_id。从url当中获取
        :return: code 和 message
        '''
>>>>>>> origin/LZY——New
        if request.method == 'POST':
            data = request.data
            user_id = request.query_params.get('user_id', None)
            comment_id = request.query_params.get('comment_id', None)

            organizer = Organizer.objects.filter(org_id = user_id).first()
            customer = Customer.objects.filter(cus_id = user_id).first()

            if customer is None and organizer is not None:# 当前用户是组织方才能继续
                comment = Comment_cus.objects.filter(comment_id = comment_id).first()

                if comment is None:
<<<<<<< HEAD
                    return Response({'code':'2', 'message':'There is no comment data'}, status = 404) # 找不到这个comment
                
                real_organizer = comment.event.organization
                if organizer != real_organizer:
                    return Response({'code':'2', 'message':'Sorry, you are not the organizer of this event'}, status = 404) # 当前组织方不是这个活动组织方
                past_reply = Reply_org.objects.filter(comment = comment).first()

                if past_reply is not None: # 如果曾经这个org在本评论下发表过回复，那就不能再回复了
                    return Response({"code":'2', "message":"You have already give the reply"}, status = 400)
=======
                    return Response({
                        'code':'2',
                        'message':'There is no comment data'
                    }, status = 404) # 找不到这个comment
                
                real_organizer = comment.event.organization
                if organizer != real_organizer:
                    return Response({
                        'code':'2',
                        'message':'Sorry, you are not the organizer of this event'
                    }, status = 404) # 当前组织方不是这个活动组织方
                past_reply = Reply_org.objects.filter(comment = comment).first()

                if past_reply is not None: # 如果曾经这个org在本评论下发表过回复，那就不能再回复了
                    return Response({
                        "code":'2',
                        "message":"You have already give the reply"
                    }, status = 400)
>>>>>>> origin/LZY——New
                
                reply = Reply_org(
                    reply_org = data['reply_org'],
                    reply_time = timezone.now().replace(second=0, microsecond=0),
                    event = comment.event,
                    organization = organizer,
                    comment = comment
                )
                reply.save()      

<<<<<<< HEAD
            return Response({'code':'2', 'message':'Not a valid organizer for this event'}, status = 400)

        return Response({'code': '4', 'message': 'This function only accepts GET data'}, status = 405)
=======
            return Response({
                'code':'2',
                'message':'Not a valid organizer for this event'
            }, status = 400)

        return Response({
            'code': '4',
            'message': 'This function only accepts GET data'
        }, status = 405)
>>>>>>> origin/LZY——New


# 订购和取消功能
class PayAndCancel:
    @api_view(['POST'])
    def payment(request): #测试完成
        '''
        :request ：接收JSON格式数据，数据内包括{ticket_type, ticket_number}。同时从url内获取 event_id 和 user_id

        url格式：传入url的时候要按照这样传入 http://127.0.0.1:8000/booking/?email=2545322339@qq.com&event_id=1

<<<<<<< HEAD
        :param user_id: 用户的id
        :param event_id: 订购演出的id
=======
>>>>>>> origin/LZY——New
        :return: code = [1, 2, 3, 4]
        '''
        email = request.query_params.get('email', None)
        event_id = request.query_params.get('event_id', None)
        # print("come here 1")

        if not email or not event_id:
            # print("come here 2")
<<<<<<< HEAD
            return Response({'code': '3', 'message': 'Missing email or event_id'}, status = 400)
        # print(email) 
        # print(event_id)
        # return Response({'code': '3', 'message': 'Missing email or event_id'}, status=400)
=======
            return Response({
                'code': '3',
                'message': 'Missing email or event_id'
            }, status = 400)

>>>>>>> origin/LZY——New
        if request.method == 'POST':
            try:
                data = json.loads(request.body.decode('utf-8'))
                # print("come here 3")
            except json.JSONDecodeError:
                # print("come here 4")
<<<<<<< HEAD
                return Response({'code': '3', 'message': 'Invalid json data'}, status = 400)
=======
                return Response({
                    'code': '3',
                    'message': 'Invalid json data'
                }, status = 400)
>>>>>>> origin/LZY——New
            # print("come here 5")
            organizer = Organizer.objects.filter(org_email = email).first()
            if organizer:
                # print("come here 6")
<<<<<<< HEAD
                return Response({'code':'2', "message": "Only customer can book the event."}, status = 200)
=======
                return Response({
                    'code':'2',
                    "message": "Only customer can book the event."
                }, status = 200)
>>>>>>> origin/LZY——New

            # print("come here 7")
            ticket_type = data['ticket_type']
            ticket_number = int(data['ticket_number'])
            if ticket_number and ticket_type:
                # print("come here 8")
                customer = Customer.objects.filter(cus_email = email).first()
                event = Event_info.objects.filter(event_id = event_id).first()
                ticket = Ticket_info.objects.filter(event = event, ticket_type = ticket_type).first()
                if ticket.ticket_remain > 0:
                    # print("come here 8")
                    total_booked_tickets = Reservation.objects.filter(event=event, ticket=ticket).count()
                    row_number = total_booked_tickets // 20 + 1  # 确定排数，每排20个座位
                    seat_number = total_booked_tickets % 20 + 1  # 确定在当前排的座位号
                    seat_assignment = f"{ticket_type}-{row_number}-{seat_number}"

                    history_booking = Reservation.objects.filter(customer = customer, event = event, ticket = ticket).first()
                    if history_booking:
                        # print("come here 9")
                        history_booking.amount += ticket_number
                        history_booking.reserve_seat += " " + seat_assignment
                        history_booking.save()
                    else:
                        # print("come here 10")
                        new_reserve = Reservation(
                            reservation_time = timezone.now().replace(second=0,microsecond=0),
                            event = event,
                            customer = customer,
                            ticket = ticket,
                            amount = ticket_number,
                            reserve_seat = seat_assignment
                        )
                        new_reserve.save()
                    # print("come here 11")
                    ticket.ticket_remain -= ticket_number
                    if ticket.ticket_remain < 0:
                        ticket.ticket_remain = 0
                    # print("come here 12")
                    ticket.save()
                    # print("come here 13")
<<<<<<< HEAD
                    return Response({'code': '1', 'message': 'Successfully booking.'}, status = 200)
                else:
                    return Response({'code':'2', 'message': 'There is no remain tickect for this type for this event.'}, status = 200)
            else:
                # print("come here 14")
                return Response({'code':'2', 'message':'something wrong with the data'}, status = 400)
        else:
            Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)

    @api_view(['POST'])
    def cancel_ticket(request): #测试完成
        # print("come here 0")
        # print()
        if request.method == 'POST':
            # print("come here 1")
=======
                    return Response({
                        'code': '1',
                        'message': 'Successfully booking.'
                    }, status = 200)
                else:
                    return Response({
                        'code':'2',
                        'message': 'There is no remain tickect for this type for this event.'
                    }, status = 200)
            else:
                # print("come here 14")
                return Response({
                    'code':'2',
                    'message':'something wrong with the data'
                }, status = 400)
        else:
            Response({
                'code': '4',
                'message': 'This function only accepts POST data'
            }, status = 405)

    @api_view(['POST'])
    def cancel_ticket(request): #测试完成
        '''
        取消演出票的功能
        接收参数 reservation_id 和 amount(数量)。从url当中获取
        :return:
        '''

        if request.method == 'POST':
>>>>>>> origin/LZY——New

            reservation_id = request.query_params.get('reservation_id', None)
            amount = int(request.query_params.get('amount', 0))
            # print("come here 2")
            reservation = Reservation.objects.filter(reservation_id = reservation_id).first()
            # print("come here 3")
            if reservation is None or reservation.amount < amount: 
<<<<<<< HEAD
                return Response({"code":"2", "message":"There is something wrong with the input data"}, status = 404) # 找不到这个订票信息
=======
                return Response({
                    "code":"2", 
                    "message":"There is something wrong with the input data"
                }, status = 404) # 找不到这个订票信息
>>>>>>> origin/LZY——New
            # print("come here 4")
            customer = reservation.customer
            ticket = reservation.ticket
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

<<<<<<< HEAD
            return Response({'code':'1', 'message': 'Refund processed successfully'}, status = 200)
        
        return Response({'code':'4','message':'Please use the POST method'}, status = 405)
=======
            return Response({
                'code':'1', 
                'message': 'Refund processed successfully'
            }, status = 200)
        
        return Response({
            'code':'4',
            'message':'Please use the POST method'
        }, status = 405)
>>>>>>> origin/LZY——New
