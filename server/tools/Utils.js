
function JsonIsNull(value) {
  var type;
  if (value == null) { // 等同于 value === undefined || value === null  
    return true;
  }

  if (Array.isArray(value) && value.length==0) {
    return true;
  }

  return false;
};

function GetTimeStamp() {
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  console.log("当前时间戳为：" + timestamp);
  return timestamp;
}

//获取月日字符串
function GetYMD(timestamp) {
  var date = new Date(timestamp);
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

  var newDay = Y + "-" + M + "-" + D;
  //console.log(M + D);
  return newDay;
}

//获取今天月日
function GetTodayYMD() {
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

  var newDay = Y + "-" + M + "-" + D;

  return newDay;
}


module.exports =
  {
    GetTimeStamp: GetTimeStamp,
    GetYMD: GetYMD,
    GetTodayYMD: GetTodayYMD,
    JsonIsNull: JsonIsNull
  }