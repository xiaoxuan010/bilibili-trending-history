var http = require("https");
var fs = require("fs");
var moment = require('moment');

//GET请求热搜数据
function getTrending() {
    BTrendingUrl = 'https://api.bilibili.com/x/web-interface/search/square?limit=10';
    http.get(BTrendingUrl, (res) => {
        // console.debug('statusCode:', res.statusCode);
        // console.debug('headers:', res.headers);

        //收到输入，调用记录函数
        res.on('data', creatRecord);
    }).on('error', (e) => {
        console.error(e);
    });
}

//创建记录
function creatRecord(data) {
    //生成记录数据
    //生成时间戳
    var nowTime = new moment();
    var nowTimeStamp = nowTime.format("X");
    var nowTimeStr = nowTime.format("Y-MM-DDTHH:mm:ssZZ");
    //生成热搜列表
    var dataStr = data.toString();
    var dataObj = JSON.parse(dataStr);
    var showNameArr = dataObj.data.trending.list.map(obj => { return obj.show_name });

    //标准输出
    console.log("\n记录开始.")
    console.log(nowTimeStamp, nowTimeStr);
    showNameArr.forEach((elem, index) => {
        console.log(index + 1, elem);
    });
    console.log("记录结束.\n")

    //文件输出
    //构造完整输出
    var bilibiliTrendingHistory = '\n记录开始.\n'
        + nowTimeStamp
        + ' '
        + nowTimeStr
        + '\n'
    showNameArr.forEach((showName, index) => {
        bilibiliTrendingHistory += `${index + 1}. ${showName}\n`;
    });
    bilibiliTrendingHistory += '\n原始数据：\n' + dataStr
        + '\n\n记录结束.\n';
    // console.debug(bilibiliTrendingHistory);
    var fileName = nowTime.format("Y-MM-DDTHH");
    //创建目录
    try {
        fs.statSync('record/');
    } catch (error) {
        //若目录不存在
        // console.debug('record目录不存在，已创建.')
        fs.mkdirSync(`${__dirname}/record`);
    }
    //写入记录
    fs.writeFile(`record/${fileName}.log`, bilibiliTrendingHistory, { flag: 'a' }, err => {
        if (err) {
            console.error(err);
            return;
        }
    })
    return;
}

//主入口
getTrending();