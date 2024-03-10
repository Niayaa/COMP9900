# COMP9900 P8 EVENTS MANAGEMENT SYSTEM
****
Zhuoyang Li |z5391485|

Zixiang Zhou |z5473539|

Liyongshi Chen |z5375235|

Shulin Li |z5345395|

Huihua Huang |z5405386|

Jingpeng Ni |z5435701|
****
## Update Contents
2024/03/07 Navbar functionality uploaded

2024/03/10 Customer Page uploaded

2024/03/10 Organizer uploaded Customer Page updated
****
## Contents
* [Abstract](#Abstract)
* [Timeline](#Timeline)
* [Approach](#Approach)
* [Requirememt](#Requirement)
* [Protential issue]

### Abstract
-----------
#### just copied general information from the resource
Numerous companies want to host events, allow customers to book tickets for such events, 
provide booking management capabilities to customers, and deliver ongoing information about their hosted events. 
Event Management System provides a platform to achieve that

### Approach 
#### 2.1.1. Organizer registration and event management
1.	As an event host, I would like to register and log in using username and password credentials so that I can securely access the system and manage my event.
2.	As an event organizer, I want to publicize and release a new event with detailed information so that potential customers can learn about it and decide to attend my event.
3.	As an event host, I want to broadcast a message to all clients who have booked my event so that I can convey important information or updates.
4.	As an event organizer, I hope that I can manage my events, including but not limited to changing the title description type, venue, event time, ticket quantity, ticket sales period and other detailed availability. 
5.	As an event organizer, I would like to receive real-time reports on the sales of my events so that I can adjust my marketing strategies in a timely manner. 
6.	As an event organizer, I would like to be able to customize my event page, including adding pictures and videos, so that I can display my event more attractively. 
7.	As an event organizer, I hope to be able to set different levels of ticket prices, such as VIP tickets and ordinary tickets, to meet the needs of different customers. 
8.	As an organizer, I want to click on an event details page to check whether its information is correct.
#### 2.1.2. Customer booking management
1.	As a prospective customer, I would like to see a list of upcoming unsold events for the next month so that I can decide which event I would like to attend.
2.	As a prospective user, I want to click on a specific activity and view its details.
3.	As a prospective customer, I wish to register my details, including payment information, so that I can easily book tickets for events that interest me.
4.	As a user, I want to click into a specific activity and view its details.
5.	As a customer, I wish to reserve tickets for an event and select an available seat so that I can attend the event at my preferred location within the venue.
6.	As a customer, I would like to be able to cancel my booking and receive a full refund if the event is at least 7 days away so that I am not penalized for changes in my schedule. 
7.	As a prospective user, I hope to sort the activities in ascending/descending order, sorted by time.
8.	As a user, I wish to browse event information so I can decide if it matches my interests and order tickets.
9.	As a user, I would like to be able to log into the interface so that I can view the shows I have purchased tickets for, so that I can easily book show tickets.
#### 2.1.3. Feedback and recommendations
1.	(Novel)As a customer, I would like to leave one review for the event I attended so that I can share my experience with the community. I can also choose whether to leave an image with the comment at the same time.
2.	As an event host, I would like to respond to comments left by customers so that I can interact with my audience and address any feedback.
3.	As a customer, I want to read all event reviews and organizer responses so that I can make informed decisions about which events to attend in the future.
4.	As a customer, I would like the system to recommend activities to me based on my past bookings and preferences so that I can discover new activities that I may like.
5.	As a customer, I would like to be able to rate activities through a rating system so that I can express my satisfaction more visually. 
6.	As an event organizer, I would like to be able to receive a summary of feedback and ratings from my clients so that I can understand what aspects of my event went well and what needs improvement. 
7.	As a customer, I want to be able to see the popularity event, such as the number of people interested, so that I can decide whether book the tickets for this event.
8.	(Novel)As an event organizer, I hope to obtain statistical information such as age and interests of customers so that I can organize events in the future that are more in line with the preferences of the target audience. 
#### 2.1.4. Search function
1.	As a customer, I would like to search for activities by title, description, and type so that I can more efficiently find activities that match my interests.
2.	As a potential customer, I would like to search for events by title, description, and type so that I can more efficiently find events that match my interests.
#### 2.1.5. Security and privacy
1.	As a user, I hope that all my personal information and payment information will be strictly protected to prevent data leakage or unauthorized access.
### Requirement
#### Demon A
Date: Week 5 Lab
##### All member needs to attend otherwise 0 score
##### Progressive Demo A (during Week 5 Lab Time) (worth 2.5%)
Progressive Demo A provides an opportunity to showcase Sprint 1 user stories and
how well you have developed functionality to support these.
##### Marking Criteria
a) Completed user stories to be demonstrated are shown in Jira and
described, with these user stories having the correct status in Jira (that is,
Done) (worth 1%)
b) Demonstrates the functionality used to support each completed user
story (worth 1%)
c) Keep the demo between 10 and 12 minutes (worth 0.5%)

### Timeline
* Week 4-5 Foundation of the system 
   * Back-end
      * 搭建基础的后端架构，包括API服务器、认证系统
         * 认证与授权：实现用户认证（注册、登录）和授权机制（如JWT、OAuth），确保系统安全性。
      * 开发核心业务逻辑，如用户管理、事件管理等搭建API服务器：选择合适的框架（如Express.js、Django、Flask等）搭建RESTful API服务器。确保能处理HTTP请求，并返回正确的响应。
         * 核心业务逻辑：
         * 用户管理：开发用户注册、登录、资料编辑等功能的后端逻辑。 
         * 事件管理：实现事件的创建、编辑、浏览、搜索等功能的后端逻辑。
         * API文档：使用Swagger或Postman等工具编写API文档，方便前端开发和API测试
            * 我们将需要使用的API
               * Google map
               * 针对关键词搜索的解决方案
                  * 使用专门的搜索引擎
                  * Elasticsearch: 一个基于Lucene的高性能、RESTful搜索引擎，非常适合于处理复杂的搜索查询和大量数据。它提供了全文搜索功能以及复杂的分析功能。
                     '''
                        const express = require('express');
                        const { Client } = require('@elastic/elasticsearch');
                        const app = express();
                        const client = new Client({ node: 'http://localhost:9200' });
                        
                        app.get('/search', async (req, res) => {
                            const { query } = req.query;
                            const { body } = await client.search({
                                index: 'your_index',
                                body: {
                                    query: {
                                        match: {
                                            name: query // 假设是按照名称字段搜索
                                        }
                                    }
                                }
                            });
                        
                            res.json(body.hits.hits);
                        });
                        
                        app.listen(3000, () => console.log('Search API running on port 3000'));
                    '''
  
                  * Solr: 同样基于Lucene，是一个开源搜索平台，提供全文搜索、高亮显示、自定义搜索等功能             
               * Paypal
   * Front-end
      * 框架搭建：基于选择的前端框架 React，搭建应用的基础结构，包括路由设置、状态管理（如使用Redux、Vuex）。
      * 界面原型：根据需求设计界面原型，可以使用工具（如Figma、Sketch）制作。
      * 基础页面开发：
         * 首页：展示事件概览，包括搜索和筛选功能。
         * 用户注册登录界面：实现用户注册和登录表单，以及与后端的交互逻辑。
         * 事件创建界面（如果时间允许）：允许用户输入事件详情，并提交到后端
         * 设计用户界面
            * 界面设计：根据需求分析，设计应用的用户界面。可以使用原型设计工具（如Figma, Sketch等）来创建界面原型。
            * 样式开发：使用CSS或CSS预处理器（如SASS, LESS）实现界面的样式。考虑使用响应式设计来适配不同设备。
         * 实现页面组件
            * 基础组件开发：开发应用中复用性高的基础组件，例如导航栏、按钮、输入框等。
            * 页面开发：根据设计原型，开发具体的页面，如主页、用户注册登录界面等。在这个阶段，可以先使用静态数据来模拟页面展示。
         * 实现前后端交互
     * API调用：实现前端页面与后端API的交互。可以使用Fetch API或Axios等库来发送HTTP请求。   
     * 数据展示：处理从后端获取的数据，动态地展示在页面上。实现数据的增删改查操作的前端逻辑。
     * 状态管理：对于较复杂的应用，可能需要引入状态管理库（如Redux, Vuex, Context API等）来管理跨组件的状态
   * Database
      * 数据库模型设计：根据需求分析结果，设计数据库模型。包括用户信息表、事件信息表等，确定表之间的关系，如一对多、多对多等。
         * 最好给出一个diagram对于不同的table关系 
      * 实现数据访问层（DAL）：编写代码实现对数据库的基本操作，如增删改查。可以使用ORM（对象关系映射）工具简化开发。
      * 数据迁移脚本：创建数据迁移脚本，以便在数据库结构变更时更新数据库，而不会丢失数据
* Week 6-7 功能开发与集成
   * Back-end：
      * 继续开发和完善业务逻辑，如票务系统、通知系统等。
   * Front-end：
      * 根据需求开发更多的功能页面，如事件详情页、购票页面等。
   * Database：
      * 根据开发进度调整和优化数据库模型，实现更复杂的查询逻辑      
         
             
      
