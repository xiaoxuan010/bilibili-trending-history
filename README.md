# 声明

本程序名称为“B站热搜历史记录程序”。
“bilibili”，“哔哩哔哩”等系上海宽娱数码科技有限公司的商标，本程序不是“哔哩哔哩弹幕视频网”。

Copyright (C) 2023, xiaoxuan010
本程序是一个自由软件，你可以重新分发它，可以修改它，但要遵守GPL 2.0版本或者后续其他版本。
我们希望本程序是有用的，但是我们不保证它能用，不保证它好用，我们不提供任何保证。

# 使用步骤

1. 请确保您已经部署好NodeJS环境.

2. 克隆本存储库: 

   `git clone https://github.com/xiaoxuan010/bilibili-trending-history`

3. 进入目录: 

   `cd bilibili-trending-history`

4. 安装必要依赖: 

   `npm install`

5. 运行主程序。

   `node ./main.js`

   程序运行完毕后，您可以在控制台看到时间戳以及格式化后的热搜数据；您可以在record文件夹中看到以时间命名的日志文件，其中包含精确时间戳、格式化数据、原始数据等。

6. 使用 cron 等守护进程以定时运行本程序.