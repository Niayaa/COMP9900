# import random
# import numpy as np
# from sklearn.metrics import jaccard_score

# # 重新定义标签和转换函数，考虑到TypeError需要将集合转换为列表进行随机选择
# live_tags = ['rock', 'pop', 'electronic', 'jazz', 'acoustic', 'indie', 'folk', 'blues', 'country', 'reggae']
# show_tags = ['magic', 'dance', 'circus', 'drama', 'puppetry', 'illusion', 'mime', 'ballet', 'opera', 'theater']
# comedy_tags = ['standup', 'improv', 'satire', 'sketch', 'dark', 'parody', 'slapstick', 'absurdist', 'observational', 'situational']
# opera_tags = ['classic', 'modern', 'experimental', 'baroque', 'romantic', 'italian', 'german', 'french', 'russian', 'english']

# # 合并所有标签为一个列表
# all_tags = live_tags + show_tags + comedy_tags + opera_tags

# # 生成演出活动，每个活动随机选择5个标签
# events = {f'Event{i}': random.sample(all_tags, 5) for i in range(1, 5)}

# # 生成一个用户偏好，随机选择6个标签
# user_pref = set(random.sample(all_tags, 6))

# # 将标签集合转换为向量
# def tags_to_vector(tags, all_tags):
#     return np.array([int(tag in tags) for tag in all_tags])

# all_tags_list = list(all_tags)  # 将所有标签转换为列表以固定顺序
# user_vector = tags_to_vector(user_pref, all_tags_list)

# # 计算Jaccard相似度
# jaccard_scores = {}
# for event, tags in events.items():
#     event_vector = tags_to_vector(tags, all_tags_list)
#     score = jaccard_score(user_vector, event_vector, average='binary')
#     jaccard_scores[event] = score

# # 推荐相似度最高的演出
# recommended_event = max(jaccard_scores, key=jaccard_scores.get)

# print(user_pref)
# for event_id, tags in events.items():
#     print(f"{event_id}: {tags}")
# print(recommended_event)

# (events, user_pref, recommended_event, jaccard_scores[recommended_event])


import requests

headers = {
    'X-PAYPAL-SECURITY-CONTEXT': '{"actor":{"account_number":"1659371090107732880","party_id":"1659371090107732880","auth_claims":["AUTHORIZATION_CODE"],"auth_state":"ANONYMOUS","client_id":"zf3..4BQ0T9aw-ngFr9dmOUZMwuKocrqe72Zx9D-Lf4"},"auth_token":"A015QQVR4S3u79k.UvhQ-AP4EhQikqOogdx-wIbvcvZ7Qaw","auth_token_type":"ACCESS_TOKEN","last_validated":1393560555,"scopes":["https://api-m.sandbox.paypal.com/v1/payments/.*","https://api-m.sandbox.paypal.com/v1/vault/credit-card/.*","openid","https://uri.paypal.com/services/payments/futurepayments","https://api-m.sandbox.paypal.com/v1/vault/credit-card","https://api-m.sandbox.paypal.com/v1/payments/.*"],"subjects":[{"subject":{"account_number":"2245934915437588879","party_id":"2245934915437588879","auth_claims":["PASSWORD"],"auth_state":"LOGGEDIN"}}]}',
}

        # {
        #     "actor": {
        #         "account_number": "1659371090107732880",
        #         "party_id": "1659371090107732880",
        #         "auth_claims": ["AUTHORIZATION_CODE"],
        #         "auth_state": "ANONYMOUS",
        #         "client_id": "zf3..4BQ0T9aw-ngFr9dmOUZMwuKocrqe72Zx9D-Lf4"
        #     },
        #     "auth_token": "A015QQVR4S3u79k.UvhQ-AP4EhQikqOogdx-wIbvcvZ7Qaw",
        #     "auth_token_type": "ACCESS_TOKEN",
        #     "last_validated": 1393560555,
        #     "scopes": [
        #         "https://api-m.sandbox.paypal.com/v1/payments/.*",
        #         "https://api-m.sandbox.paypal.com/v1/vault/credit-card/.*",
        #         "openid",
        #         "https://uri.paypal.com/services/payments/futurepayments",
        #         "https://api-m.sandbox.paypal.com/v1/vault/credit-card",
        #         "https://api-m.sandbox.paypal.com/v1/payments/.*"
        #     ],
        #     "subjects": [
        #         {
        #         "subject": {
        #             "account_number": "2245934915437588879",
        #             "party_id": "2245934915437588879",
        #             "auth_claims": ["PASSWORD"],
        #             "auth_state": "LOGGEDIN"
        #         }
        #         }
        #     ]
        # }
data = '{ "intent": "sale", "payer": { "payment_method": "paypal" }, "transactions": [ { "amount": { "total": "30.11", "currency": "USD", "details": { "subtotal": "30.00", "tax": "0.07", "shipping": "0.03", "handling_fee": "1.00", "shipping_discount": "-1.00", "insurance": "0.01" } }, "description": "The payment transaction description.", "custom": "EBAY_EMS_90048630024435", "invoice_number": "48787589673", "payment_options": { "allowed_payment_method": "INSTANT_FUNDING_SOURCE" }, "soft_descriptor": "ECHI5786786", "item_list": { "items": [ { "name": "hat", "description": "Brown hat.", "quantity": "5", "price": "3", "tax": "0.01", "sku": "1", "currency": "USD" }, { "name": "handbag", "description": "Black handbag.", "quantity": "1", "price": "15", "tax": "0.02", "sku": "product34", "currency": "USD" } ], "shipping_address": { "recipient_name": "Brian Robinson", "line1": "4th Floor", "line2": "Unit #34", "city": "San Jose", "country_code": "US", "postal_code": "95131", "phone": "011862212345678", "state": "CA" } } } ], "note_to_payer": "Contact us for any questions on your order.", "redirect_urls": { "return_url": "https://example.com/return", "cancel_url": "https://example.com/cancel" } }'
# data = {
#     "intent": "sale",
#     "payer": {
#     "payment_method": "paypal"
#     },
#     "transactions": [
#     {
#         "amount": {
#         "total": "30.11",
#         "currency": "USD",
#         "details": {
#             "subtotal": "30.00",
#             "tax": "0.07",
#             "shipping": "0.03",
#             "handling_fee": "1.00",
#             "shipping_discount": "-1.00",
#             "insurance": "0.01"
#         }
#         },
#         "description": "The payment transaction description.",
#         "custom": "EBAY_EMS_90048630024435",
#         "invoice_number": "48787589673",
#         "payment_options": {
#         "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
#         },
#         "soft_descriptor": "ECHI5786786",
#         "item_list": {
#         "items": [
#             {
#             "name": "hat",
#             "description": "Brown hat.",
#             "quantity": "5",
#             "price": "3",
#             "tax": "0.01",
#             "sku": "1",
#             "currency": "USD"
#             },
#             {
#             "name": "handbag",
#             "description": "Black handbag.",
#             "quantity": "1",
#             "price": "15",
#             "tax": "0.02",
#             "sku": "product34",
#             "currency": "USD"
#             }
#         ],
#         "shipping_address": {
#             "recipient_name": "Brian Robinson",
#             "line1": "4th Floor",
#             "line2": "Unit #34",
#             "city": "San Jose",
#             "country_code": "US",
#             "postal_code": "95131",
#             "phone": "011862212345678",
#             "state": "CA"
#         }
#         }
#     }
#     ],
#     "note_to_payer": "Contact us for any questions on your order.",
#     "redirect_urls": {
#     "return_url": "https://example.com/return",
#     "cancel_url": "https://example.com/cancel"
#     }
#     }




response = requests.post('https://api-m.sandbox.paypal.com/v1/payments/payment', headers=headers, data=data)

# print(response.json())
# if response.headers['Content-Type'] == 'application/json':
    # print(response.json())  # 这将返回一个Python字典