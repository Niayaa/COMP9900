# COMP9900 P8 : Event Management System
****
|Author|Liyongshi Chen|
|z5375235|
****
## Contents
* [Abstract](#Abstract)
* [Approach](#Approach)
* [Requirememt]
* [Timeline]
* [Protential issue]

### Abstract
-----------
#### just copied general information from the resource
Numerous companies want to host events, allow customers to book tickets for such events, 
provide booking management capabilities to customers, and deliver ongoing information about their hosted events. 
Event Management System provides a platform to achieve that

### Approach 
* Hosts to register and login using username and password credentials. 使⽤⽤⼾名和密码凭据进⾏注册和登录的主机。
    * 登录界面
        * 登录界面需要用到基础的UI/UX设计，使用HTML, CSS, 和JavaScript开发登录页面，包括用户名和密码输入框以及提交按钮，注册按钮（注册表单是否需要单独做一个page？）。
        * 需要验证后告知用户密码或者用户名是否正确
        * 通过用户类别进入不同的page
        * 如果不正确需要重新输入
        * 用户注册细则
          * 用户名，密码，用户类别（顾客还是组织方）
          * 是否需要给用户提供密码忘记的hint？（比较简单粗暴，不需要做忘记密码找回密码的设计）
          * 是否需要做找回密码的设计（optional）
            * 找回密码可以实现的选项
              * 系统根据提供的邮箱或用户名查找用户账户。如果账户存在，系统生成一个唯一的、有时间限制的密码重置链接或验证码。
                * 使用安全的随机数生成器生成令牌，并确保令牌在数据库中与用户记录关联，同时记录令牌的过期时间。  
              * 使用SMTP服务器或第三方邮件发送服务（如SendGrid, Amazon SES）来发送包含重置链接的邮件。
              * 后端需要更新重新设定的密码
    * 用户数据传输
      * 后端语言：Node.js (Express.js), Python (Django, Flask), Java (Spring Boot), PHP (Laravel)
      * 是否需要追踪用户登录状态（太难了optional）
        * 实现会话管理，以跟踪已登录用户的状态。可以使用cookie或者token实现。
      * 是否需要对用户密码进行加密工作
        * 用户密码应该经过哈希处理后存储，常用的哈希算法有bcrypt。
    * 用户数据存储
      * 设计数据库表格来存储用户信息，至少包括用户名、哈希处理后的密码、邮箱等字段
      * MySQL, PostgreSQL, MongoDB
    * 安全
      * 密码加密（？）
      * 传输协议
      * license
      * 如何防止恶意攻击（optional）
        * 设置机器人检测
        * 不允许多次重复提交表单
        * 错误密码输入数量限制
* Hosts, once registered, to advertise a new event with details on the event title, description,type (e.g., concert, theatre, etc.),
  venue (name and address), event start/end date/time, number of tickets available, ticket price, etc 主办⽅⼀旦注册，即可宣传新活
动，并提供活动标题、描述、类型（例如⾳乐会、剧院等）、场地（名称和地址）、活动开始/结束⽇期/时间、⻔票数量等详细信息可⽤情况、⻔票价格等。
  * 组织方界面
    * 组织方申请活动表格
      * 表单类型一致，方便数据存储
      * 提供上传图片功能（主办方活动海报宣传）
      * 场地地址
        * 是否需要嵌入Google Map方便用户查找
          * 使用Google Maps Embed API
            * 获取API密钥：访问Google Cloud Console（https://console.cloud.google.com/）。创建一个新项目或选择一个现有项目。导航到“API与服务”>“凭据”，创建一个新的API密钥。嵌入地图：
              在HTML页面中，使用<iframe>标签嵌入地图，如下所示（将YOUR_API_KEY替换为你的API密钥，将YOUR_ADDRESS替换为你想显示的地址）：
              ```css
              <iframe width="600"
              height="450"
              style="border:0"
              loading="lazy"
              allowfullscreen
              src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=YOUR_ADDRESS">
            </iframe>
              ```
          * 添加指向Google Maps的超链接
            *如果你只是想在网页上提供一个链接，点击后跳转到Google Maps上的特定地址，可以直接使用一个超链接，而无需使用API。这种方法非常简单，不需要API密钥。
            在HTML中，你可以这样做（将YOUR_ADDRESS替换为目标地址）：
             ```html
             <a href="https://www.google.com/maps/search/?api=1&query=YOUR_ADDRESS" target="_blank">查看地图</a>
             ```
这里的query参数是你希望搜索的地址。如同使用Embed API一样，地址可能需要URL编码，特别是如果地址包含空格或特殊字符的时候
