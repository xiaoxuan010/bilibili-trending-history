var http = require("https");
var fs = require("fs");
var moment = require('moment');

var lastTrending30 = new Array(30);
var lastTrending10 = new Array(10);

//GET请求热搜数据
function getTrending() {
    BTrendingUrl = 'https://api.bilibili.com/x/web-interface/search/square?limit=30';
    http.get(BTrendingUrl, (res) => {
        // console.debug('statusCode:', res.statusCode);
        // console.debug('headers:', res.headers);
        var returnTime = res.headers.date;
        //收到输入，先暂存后调用
        var data = '';
        res.on('data', (chunk) => {
            data += chunk;
            // console.log('[获得返回数据]', d.toString()); 

        });
        res.on('end', () => {
            creatRecord(data, returnTime);
        });
    }).on('error', (e) => {
        console.error('[错误 001]', e);
    });
}

//创建记录
function creatRecord(data, returnTime) {
    //生成记录数据
    //生成时间戳
    var nowTime = new moment();
    var nowTimeStamp = nowTime.format("X");
    var nowTimeStr = nowTime.format("Y-MM-DD HH:mm:ssZZ");
    //生成热搜列表
    var dataStr = data.toString();
    var dataObj = JSON.parse(dataStr);
    var showNameArr = dataObj.data.trending.list.map(obj => { return obj.show_name });
    var showNameArr10 = showNameArr.slice(0, 10);
    var isSameAsLast30 = (showNameArr.toString() == lastTrending30.toString());
    var isSameAsLast10 = (showNameArr10.toString() == lastTrending10.toString());
    // console.log(isSameAsLast10, isSameAsLast30, lastTrending10, lastTrending30);
    lastTrending30 = showNameArr;
    lastTrending10 = showNameArr10;

    //标准输出
    if (isSameAsLast10) {
        console.log("本地时间: ", nowTimeStr);
        console.log('热搜前10未改变.')
    }
    else {
        console.log("\n记录开始.");
        console.log("服务器时间: ", returnTime);
        console.log("本地时间: ", nowTimeStr);
        showNameArr10.forEach((elem, index) => {
            console.log(index + 1, elem);
        });
        console.log("记录结束.\n")
    }


    //文件输出
    //构造完整输出
    var bilibiliTrendingHistory = '\n记录开始.\n服务器时间: '
        + returnTime + '\n本地时间: '
        + nowTimeStr
        + ' '
        + nowTimeStamp
        + '\n';
    if (isSameAsLast30) {
        bilibiliTrendingHistory += '热搜榜未发生改变.'
    }
    else {
        showNameArr.forEach((showName, index) => {
            bilibiliTrendingHistory += `${index + 1}. ${showName}\n`;
        });
    }
    bilibiliTrendingHistory += '\n原始数据：\n' + dataStr
        + '\n\n记录结束.\n';
    // console.debug(bilibiliTrendingHistory);
    var fileName = nowTime.format("Y-MM-DDTHH");
    //创建目录
    try {
        fs.statSync('record/');
    } catch (error) {
        fs.mkdirSync(`${__dirname}/record`);
    }
    //写入记录
    fs.writeFile(`record/${fileName}.log`, bilibiliTrendingHistory, { flag: 'a' }, err => {
        if (err) {
            console.error('[错误 002]', err);
        }
    });

    //构造简要输出
    if (isSameAsLast30)
        return;//若热搜一样则直接跳过
    var briefOutputStr = '时间: '
        + nowTime.format('Y-MM-DD HH:mm:ss')
        + '\n'
    showNameArr.forEach((showName, index) => {
        briefOutputStr += `${index + 1}. ${showName}\n`;
    });
    briefOutputStr += '\n';
    var fileName = nowTime.format("Y-MM-DDTHH");
    try {
        fs.statSync('brief/');
    } catch (error) {
        fs.mkdirSync(`${__dirname}/brief`);
    }
    fs.writeFile(`brief/${fileName}.log`, briefOutputStr, { flag: 'a' }, err => {
        if (err) {
            console.error('[错误 003]', err);
        }
    });

    return;
}

//主入口
getTrending();
setInterval(getTrending, 5000);