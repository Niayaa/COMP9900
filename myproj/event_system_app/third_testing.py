import random
import numpy as np
from sklearn.metrics import jaccard_score

# 重新定义标签和转换函数，考虑到TypeError需要将集合转换为列表进行随机选择
live_tags = ['rock', 'pop', 'electronic', 'jazz', 'acoustic', 'indie', 'folk', 'blues', 'country', 'reggae']
show_tags = ['magic', 'dance', 'circus', 'drama', 'puppetry', 'illusion', 'mime', 'ballet', 'opera', 'theater']
comedy_tags = ['standup', 'improv', 'satire', 'sketch', 'dark', 'parody', 'slapstick', 'absurdist', 'observational', 'situational']
opera_tags = ['classic', 'modern', 'experimental', 'baroque', 'romantic', 'italian', 'german', 'french', 'russian', 'english']

# 合并所有标签为一个列表
all_tags = live_tags + show_tags + comedy_tags + opera_tags

# 生成演出活动，每个活动随机选择5个标签
events = {f'Event{i}': random.sample(all_tags, 5) for i in range(1, 5)}

# 生成一个用户偏好，随机选择6个标签
user_pref = set(random.sample(all_tags, 6))

# 将标签集合转换为向量
def tags_to_vector(tags, all_tags):
    return np.array([int(tag in tags) for tag in all_tags])

all_tags_list = list(all_tags)  # 将所有标签转换为列表以固定顺序
user_vector = tags_to_vector(user_pref, all_tags_list)

# 计算Jaccard相似度
jaccard_scores = {}
for event, tags in events.items():
    event_vector = tags_to_vector(tags, all_tags_list)
    score = jaccard_score(user_vector, event_vector, average='binary')
    jaccard_scores[event] = score

# 推荐相似度最高的演出
recommended_event = max(jaccard_scores, key=jaccard_scores.get)

print(user_pref)
for event_id, tags in events.items():
    print(f"{event_id}: {tags}")
print(recommended_event)

(events, user_pref, recommended_event, jaccard_scores[recommended_event])
