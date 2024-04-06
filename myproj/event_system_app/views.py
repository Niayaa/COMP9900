from django.contrib.auth import authenticate, login
import random
import string
from django.core.cache import cache
from django.core.mail import send_mail

from rest_framework.authtoken.models import Token
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
# from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from datetime import timedelta
from collections import defaultdict


from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view
from rest_framework.decorators import APIView

from .serializer import *
from .models import *
import json

organizer_list = ['org_id', 'org_email', 'org_password', 'company_name', 'company_address', 'org_phone']

customer_list = ['cus_id', 'cus_name', 'cus_email', 'gender', 'prefer_type', 'cus_password', 'bill_address', 'cus_phone']


'''
200: 数据返回成功
400:数据错误或返回的数据格式错误
405:请求的方法错误
'''

@api_view(['GET'])
def mainpage_filter_events(request):
    '''
    mainpage界面，用户要选择两种类型，第一种是演出类型，第二种时间类型。该函数根据用户的选择，返回筛选后的演出
    :param request: 无
    :return: 'event_id', 'event_name', 'event_date', 'event_description', 'event_address', 'event_type'
    '''

    # 获取查询参数
    event_type = request.GET.get('event_type', None)  # 演出类型，如'opera', 'concert'等
    time_filter = request.GET.get('time_filter', None)  # 时间过滤条件，如'today', 'this_month', 'next_month'

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
    events = list(Event_info.objects.all().values('event_id', 'event_name', 'event_date', 'event_type'))
    empty_dict = []
    for i in events:
        filtered_event_data = {key: i[key] for key in ["event_name", "event_type", 'event_id', 'event_date']}
        empty_dict.append(filtered_event_data)


    # print(events)
    # return Response({"message":"000"})
    return JsonResponse(empty_dict, safe = False, status = 200)

@api_view(['GET'])
def get_upcoming_reservations(request, user_id):
    upcoming_events = Event_info.objects.filter(event_date__gte=timezone.now(), reservation__customer__cus_id=user_id)
    data = list(upcoming_events.values('event_id', 'event_name', 'event_date', 'event_description', 'event_address'))
    return JsonResponse(data, safe=False)

@api_view(['GET'])
def get_past_reservations(request, user_id):
    past_events = Event_info.objects.filter(event_date__lt=timezone.now(), reservation__customer__cus_id=user_id)
    data = list(past_events.values('event_id', 'event_name', 'event_date', 'event_description', 'event_address'))
    return JsonResponse(data, safe=False)


def data_match(fields_list, input_data):
    '''
    这个用于将从数据库查询到的数据，和模型匹配成字典
    '''
    return {field: getattr(input_data, field, None) for field in fields_list if hasattr(input_data, field)}

@api_view(['GET'])
# 测试完成
def get_events_grouped_by_type(request):
    events = Event_info.objects.all()
    events_grouped_by_type = defaultdict(list)

    for event in events:
        events_grouped_by_type[event.event_type].append({
            'event_id': event.event_id,
            'event_name': event.event_name,
            'event_description': event.event_description,
            'event_type':event.event_type,
            # 'event_date': event.event_date,
            # 'event_address': event.event_address,
            # 'event_image': event.event_image.url if event.event_image else None,
            # 'ticket_amount': event.ticket_amount,
            # 'last_selling_date': event.last_selling_date,
            # 'organization_id': event.organization.org_id if event.organization else None,
        })
    return JsonResponse({'events': dict(events_grouped_by_type)})


@api_view(['GET'])
# 测试完成
def get_user_preferred_events(request, user_id):
    try:
        customer = Customer.objects.get(cus_id=user_id)
        prefer_type = customer.prefer_type
        if prefer_type:
            events = Event_info.objects.filter(event_type = prefer_type.title()).\
                values('event_id', 'event_name','event_type')
        else:
            events = Event_info.objects.all().values('event_id',
                                                     'event_name',
                                                     'event_description',
                                                     'event_type')
        return JsonResponse(list(events), safe=False)
    except Customer.DoesNotExist:
        return JsonResponse({'error': 'Customer not found'}, status=404)

@api_view(['GET'])
# 测试完成
def get_all_events(request):
    events = Event_info.objects.all().values('event_id',
                                             'event_name',
                                             'event_description',
                                             'event_type')
    return JsonResponse(list(events), safe=False)

@api_view(['POST'])
# 3.31 16.42 这个函数写完了还没测试, 好像不同返回代码也没有编写(功能，生成找回密码用的验证码)
def send_reset_code(request):
    '''
    验证码的问题
    '''
    email = request.data.get('email')
    if not email:
        return JsonResponse({'error': 'Email is required'}, status = 400)

    
        # 确保邮箱对应的用户存在
    customer = Customer.objects.filter(cus_email = email).first()
    organizer = Organizer.objects.filter(org_email = email).first()
    if customer is None and organizer is None:
        return JsonResponse({'error': 'Email does not exist'}, status = 400)
    
    code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    cache.set(f'password_reset_code_{email}', code, timeout = 300)
    
    send_mail(
        'Your Password Reset Code',
        f'Your password reset code is: {code}',
        '2545322339@gmail.com',  # 发件人
        [email],  # 收件人列表
        fail_silently=False,
    )
    

    return JsonResponse({'message': 'Verification code sent successfully'})

@api_view(['POST'])
# 3.31 16.42 这个函数写完了还没测试, 好像不同返回代码也没有编写(找回密码的验证通过)
def reset_password(request):
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('newPassword')

    if not all([email, code, new_password]):
        return JsonResponse({'error': 'Missing parameters'}, status = 400)

    # 从缓存获取验证码
    cached_code = cache.get(f'password_reset_code_{email}')
    if cached_code is None or cached_code != code:
        return JsonResponse({'error': 'Invalid or expired code'}, status = 400)

    # 验证码匹配，更新用户密码

    customer = Customer.objects.filter(cus_email = email).first()
    if customer:
        customer = data_match(customer_list, customer)
        customer['cus_password'] = new_password
        customer.save()
    else:
        organizer = Organizer.objects.filter(org_email = email).first()
        organizer = data_match(organizer_list, organizer)
        organizer['org_password'] = new_password
        organizer.save()

    # 清除缓存中的验证码
    cache.delete(f'password_reset_code_{email}')

    return JsonResponse({'message': 'Password has been reset successfully'})

@api_view(['GET'])
# 3.31 17.54 accountpage的个人登录框架编写完成，还没有测试
# 测验完成
def cus_info_show(request, user_id):
    '''
    这个函数是用来导航到account页面, 返回 customer 的个人用户信息的
    '''
    if request.method == 'GET':
        print(user_id)
        customer = Customer.objects.filter(cus_id = user_id).first()
        if customer:
            customer = data_match(customer_list, customer)
            customer['age_area'] = None
            print(type(customer))
            print(customer)
            # return JsonResponse({"message":"succeeed here"})
            return JsonResponse(customer, status = 200)
            # 找到数据了，成功返回
        else:
            # account页面发来请求消费者个人信息，但是查无此人，基本不太可能，但还是写上这个功能
            return Response({'code': '4', 'message': 'This customer is not exist, you can not enter in account page'}, status = 404)
    else:
         return Response({'code': '4', 'message': 'This function only accepts GET data'}, status = 405)


@api_view(['GET'])
# 3.31 17.54 accountpage的个人登录框架编写完成，还没有测试
# 测验完成
def org_info_show(request, user_id):
    '''
    这个函数是用来导航到account页面, 返回 customer 的个人用户信息的
    '''
    if request.method == 'GET':
        print(user_id)
        organizer = Organizer.objects.filter(org_id = user_id).first()
        if organizer:
            organizer = data_match(organizer_list, organizer)
            organizer['age_area'] = None
            # print(type(customer))
            # print(customer)
            # return JsonResponse({"message":"succeeed here"})
            print(organizer)
            return JsonResponse(organizer, status = 200)
            # 找到数据了，成功返回
        else:
            # account页面发来请求消费者个人信息，但是查无此人，基本不太可能，但还是写上这个功能
            return Response({'code': '4', 'message': 'This organizer is not exist, you can not enter in account page'}, status = 404)
    else:
         return Response({'code': '4', 'message': 'This function only accepts GET data'}, status = 405)


#3.31 20.20 用户界面的修改个人信息完成
@api_view(['POST'])
def edit_cus_info(request,user_id):
    if request.method == 'POST':
        # 这个是人为创造的数据，cus数据和org数据，后面得删了
        try:
            data = json.loads(request.body)
            
            customer = Customer.objects.filter(cus_email = data['email']).first()
            customer = data_match(customer_list, customer)
            customer['cus_name'] = data['name']
            customer['cus_email'] = data['email']
            customer['cus_password'] = data['password']
            customer['gender'] = data['gender']
            customer['bill_address'] = data['bill_address']
            customer['cus_phone'] = data['phone']
            customer.save()

        except Exception as e:
            return Response({'code': '1', 'message': 'Invalid json data'}, status = 400)
    return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)


@api_view(['POST'])
def edit_org_info(request):
    if request.method == 'POST':
        # 这个是人为创造的数据，cus数据和org数据，后面得删了
        try:
            data = json.loads(request.body)
            organizer = Customer.objects.filter(cusorgail = data['email']).first()
            organizer = data_match(organizer_list, organizer)
            organizer['company_name'] = data['name']
            organizer['org_email'] = data['email']
            organizer['org_password'] = data['password']
            organizer['gender'] = data['gender']
            organizer['company_address'] = data['org_address']
            organizer['org_phone'] = data['phone']
            organizer.save()

        except Exception as e:
            return Response({'code': '1', 'message': 'Invalid json data'}, status = 400)
    return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)


@csrf_exempt
@api_view(['POST'])
def user_login(request):
    '''
    前端的登录页面，从前端获取数据，并判断是否正确

    返回code 1代表登录成功,
    返回code 2代表登录失败,

    返回类型：
    message：登录成功或登录失败的字符串
    code:1代表成功, 2代表失败, 3代表非法数据, 4代表调用失败
    user_id:只有在登录成功的时候才有，失败的时候没有。成功的时候返回的事这个人在数据库的id
    '''

    # 两个人为创造的数据，没啥用
    org_test_data = {
        'org_id': 1,
        'org_name': 'aa',
        'org_email': 'aa@qq.com',
        'org_password': 'aa',
        'company_name': 'acwing',
        'company_address': '1139/7',
        'org_phone': '11111'
    }
    cus_test_data = {
        'cus_id': 2,
        'cus_name': 'bb',
        'cus_email': 'bb@qq.com',
        'cus_password': 'bb',
        'bill_address': '1138/9',
        'cus_phone': '2222'
    }
    if request.method == 'POST':
        # 这个是人为创造的数据，cus数据和org数据，后面得删了
        try:
            data = json.loads(request.body)
            print(data)
            email = data['email']
            password = data['password']
            '''
            测试代码
            '''
            # customer = cus_test_data
            customer_data = Customer.objects.filter(cus_email = email).first()  # 正式代码
            # print(customer_data)
            # return Response({"0"})

            # print(cus_test_data)
            customer = data_match(customer_list, customer_data)
            # print(customer)
            if customer:  # 能找到这个customer
                if customer['cus_password'] == password:
                    # print("heyheyehyehey")
                    # print()
                    # print()
                    # print()

                    # print("cus successful identity")
                    # return Response("cus successful identity")
                    # print(type(customer))
                    # print(customer)
                    return Response({'code': 1, 'message': 'login success',"user_type": "customer", "token": customer['cus_id']}, status = 200)
        # except Exception as e:
        #     return Response({"0"})
                else:
                    return Response({'code': '1', 'message': 'login failed, please check username/password'})
                    
            else:  # 有可能这个人是个organizer
                organizer_data = Organizer.objects.filter(org_email=email).first()  # 正式代码
                organizer = data_match(organizer_list, organizer_data)
                # organizer = org_test_data
                if organizer:
                    if organizer['org_password'] == data['password']:  # 说明匹配上了
                        # print("org successful identity")
                        # return Response("org successful identity")
                        return Response({'code': '1', 'message': 'login success', "user_type": "organizer", "token": organizer['org_id']}, status = 200)
                    else:  # 说明密码或者其他的东西出现了错误
                        # print("org failed input data")
                        # return Response("org failed input data")
                        return Response({'code': '2', 'message': 'login failed, please check username/password',"user_type": None }, status = 400)
        except json.JSONDecodeError:
            # print("gg, wrong input")
            # return Response("gg, wrong input")
            return Response({'code': '1', 'message': 'Invalid json data'}, status = 400)
    return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)

@api_view(['POST'])
# 还没有编写完
def event_create(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            event_id = Event_info.objects.count() + 1

            # 实际前端传回来的不一定是这个变量名，注意一下

            event_name = data['name']
            event_date = data['event_data']
            event_description = data['event_description']
            event_image = data['event_image']
            event_address = data['event_address']
            event_type = data['event_type']
            ticket_amount = data['ticket_amount']

            # 最好能将ticket_type 打包一起返回
            '''
            这里还没有编写完，缺少最后的存储到数据库和各类票的构建
            '''

        except json.JSONDecodeError:
            return Response({'code': '3', 'message': 'Invalid json data'}, status = 400)

    return Response({'code': '4', 'message': 'This function only accepts POST data'}, status = 405)

@api_view(['GET'])
def testing_port(request):
    return Response({"message":"successful"})


@api_view(['POST'])
def register(request):
    """
    前端的这侧页面，从前端获取数据，并判断是否正确

    返回code 1代表登录成功,
    返回code 2代表登录失败,

    返回类型：
    message：登录成功或登录失败的字符串
    code:1代表成功, 2代表失败, 3代表非法数据, 4代表调用失败
    token:只有在登录成功的时候才有，失败的时候没有。成功的时候返回的是这个人在数据库的id
    """
    if request.method == 'POST':
        # 这个是人为创造的数据，cus数据和org数据，后面得删了
        try:
            data = json.loads(request.body)
            # print(data)
            # print(data)
            # print(data['role'])
            # print(data)
            # return Response("successful")
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
                # print("heyheyhey")

                # print("suprise")
                if existing_organizer or existing_customer:  # 检查数据库内是否存在相同的人
                    return Response({'message': 'email already registered'}, status=400)
                else:
                    new_organizer = Organizer(
                        org_id = Organizer.objects.count() + 1,
                        company_name = organization_name,
                        company_address = organization_address,
                        
                        org_email = email,
                        org_password = password,
                        org_phone = phone
                    )
                    new_organizer.save()
                    # response的内容都要修改一下，这个函数内的所有response
                return Response({'code': '1', 'message': 'JSON data received and processed successfully',"token":new_organizer.org_id}, status = 200)
                # return Response({'code': '0', 'message': 'JSON data received and processed successfully'})

            elif data['role'] == 'customer':
                if existing_customer or existing_organizer:  # 检查数据库内是否存在相同的人
                    return Response({'code': '1', 'message': 'email already registered'}, status = 400)
                else:
                    new_customer = Customer(
                        cus_id = Customer.objects.count() + 1,
                        cus_name = username,
                        bill_address = bill_address,
                        cus_email = email,
                        cus_password = password,
                        cus_phone = phone,
                        gender = None,
                        prefer_type = None
                    )
                    new_customer.save()

                # 第一种方式
                return Response({'code': '0', 'message': 'JSON data received and processed successfully', 'token':new_customer.cus_id}, status = 200)

                # 第二种方式
                    # 我估计会产生报错
                    # token, created = Token.objects.get_or_create(user = new_customer)
                    # return Response({'message': 'Customer registered successfully', 'token': token.key}, status = status.HTTP_201_CREATED)

                # "token": new_customer.token})
            # return Response({"jjjjj"})
        except   json.JSONDecodeError:
            return Response({'code': '1', 'message': 'Invalid JSON data'}, status = 400)
    else:
        return Response({'code': '1', 'message': 'This view only accepts POST requests'}, status = 405)


class EventListView(APIView):
    """
    List all events created by the logged-in user.
    """
    def get(self, request, format=None):
        events = Event_info.objects.filter(creator=request.user)
        serializer = EventinfoSerializer(events, many=True)
        return Response(serializer.data)