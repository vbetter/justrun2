function GetTimeStamp()
{
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  console.log("当前时间戳为：" + timestamp);
  return timestamp;
}

//获取月日字符串
function GetMD(timestamp)
{
  var date = new Date(timestamp);
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时
  var h = date.getHours();
  //分
  var m = date.getMinutes();
  //秒
  var s = date.getSeconds();

  console.log(M + D);
  return M+D;
}

//获取今天月日
function GetTodayMD() {
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);

  //月
  var M =  date.getMonth() + 1;
  //日
  var D =  date.getDate();


  console.log(M + D);
  return M +"月" + D + "日";
}

function Test()
{
  var timestamp = Date.parse(new Date());
  var n = timestamp * 1000;
  var date = new Date(n);
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时
  var h = date.getHours();
  //分
  var m = date.getMinutes();
  //秒
  var s = date.getSeconds();

  console.log("当前时间：" + Y + M + D + h + ":" + m + ":" + s);

}

/*
//获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var h = date.getHours();
    //分
    var m = date.getMinutes();
    //秒
    var s = date.getSeconds();

    console.log("当前时间：" +Y+M+D+h+":"+m+":"+s);

//转换为时间格式字符串
    console.log(date.toDateString());

    console.log(date.toGMTString());

    console.log(date.toISOString());

    console.log(date.toJSON());

    console.log(date.toLocaleDateString());

    console.log(date.toLocaleString());

    console.log(date.toLocaleTimeString());

    console.log(date.toString());

    console.log(date.toTimeString());

    console.log(date.toUTCString());

    //时间、时间戳加减 以加一天举例，聪明的你肯定触类旁通
    //加一天的时间戳：
    var tomorrow_timetamp = timestamp + 24 * 60 * 60;
    //加一天的时间：
    var n_to = tomorrow_timetamp * 1000;
    var tomorrow_date = new Date(n_to);
    //加一天后的年份
    var Y_tomorrow = tomorrow_date.getFullYear();
    //加一天后的月份
    var M_tomorrow = (tomorrow_date.getMonth() + 1 < 10 ? '0' + (tomorrow_date.getMonth() + 1) : tomorrow_date.getMonth() + 1);
    //加一天后的日期
    var D_tomorrow = tomorrow_date.getDate() < 10 ? '0' + tomorrow_date.getDate() : tomorrow_date.getDate();
    //加一天后的时刻
    var h_tomorrow = tomorrow_date.getHours();
    //加一天后的分钟
    var m_tomorrow = tomorrow_date.getMinutes();
    //加一天后的秒数
    var s_tomorrow = tomorrow_date.getSeconds();
*/

module.exports = 
{
  GetTodayMD: GetTodayMD,
  GetMD: GetMD,  
  GetTimeStamp: GetTimeStamp,
  Test: Test,
}