# import paypalrestsdk
# from django.http import HttpResponse
# from django.shortcuts import redirect
#
# def payment(request):
#     paypalrestsdk.configure({
#         "mode": "sandbox",  # "sandbox" 代表测试模式
#         "client_id": "ASg3Z5TQ1Yzl0iuuzMAie7X7flNwARwQYeNhatA5GVbS7X2MGWjAIfTEy0RNDMGSNitmYzUs2EufqoFE",  # 确保字符串完整
#         "client_secret": "EIRFGLROHUiEAvoYDhr6ALiG6W3Fd8nidGDJV9BhoDw3HCmxAnqQIwixmkx4BYl5sfqZ_PK6SDBY29HW"
#     })
#
#     payment = paypalrestsdk.Payment({
#         "intent": "sale",
#         "payer": {
#             "payment_method": "paypal"},
#         "redirect_urls": {
#             "return_url": "http://localhost:8000/palpay/pay/",  # 支付成功跳转页面
#             "cancel_url": "http://localhost:3000/paypal/cancel/"},  # 取消支付页面
#         "transactions": [{
#             "amount": {
#                 "total": "5.00",
#                 "currency": "USD"},
#             "description": "这是一个订单测试"}]})
#
#     if payment.create():
#         print("Payment created successfully")
#         for link in payment.links:
#             if link.rel == "approval_url":
#                 approval_url = str(link.href)
#                 print("Redirect for approval: %s" % (approval_url))
#                 return redirect(approval_url)
#     else:
#         print(payment.error)
#         return HttpResponse("支付失败")


# # from django.core.urlresolvers import reverse
# from django.shortcuts import render
# from paypal.standard.forms import PayPalPaymentsForm
# from django.conf import settings
#
#
# def view_that_asks_for_money(request):
#     # What you want the button to do.
#     paypal_dict = {
#         "business": settings.PAYPAL_REVEIVER_EMAIL,
#         "amount": "10000000.00",
#         "item_name": request.data['goods'],
#         "invoice": request.data['order_id'],
#         "notify_url": request.build_absolute_uri(reverse('www.baidu.com/paypalview/')),
#         # "notify_url": www.baidu.com/paypalview/,
#         "return": request.build_absolute_uri(reverse('www.baidu.com/ret_paypal/')),
#         # "notify_url": www.baidu.com/ret_paypal/,
#         "cancel_return": request.build_absolute_uri(reverse('www.baidu.com/can_paypal/')),
#         # "notify_url": www.baidu.com/can_paypal/,
#         "custom": "premium_plan",  # Custom command to correlate to some function later (optional)
#     }
#
#     # Create the instance.
#     form = PayPalPaymentsForm(initial=paypal_dict)
#     context = {"form": form}
#     return render(request, "payment.html", context)


