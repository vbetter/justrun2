const { mysql } = require('../qcloud')

function JsonIsNull(value) {
  var type;
  if (value == null) { // 等同于 value === undefined || value === null  
    return true;
  }
  type = Object.prototype.toString.call(value).slice(8, -1);
  switch (type) {
    case 'String':
      return !!$.trim(value);
    case 'Array':
      return !value.length;
    case 'Object':
      return $.isEmptyObject(value); // 普通对象使用 for...in 判断，有 key 即为 false  
    default:
      return false; // 其他对象均视作非空  
  }
}; 

//获取月日字符串
function GetMD(timestamp) {
  var date = new Date(timestamp);
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

  console.log(M + D);
  return M + D;
}

//打卡
async function punch(ctx, next) 
{
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  var tdistance = ctx.query.distance
  var timestamp = Date.parse(new Date());
  var todayMD = GetMD(timestamp);
  console.log("todayMD:",todayMD);
  console.log("ctx.query:",ctx.query)

  //先查询有没有这个跑团
  var res = await mysql("TeamData").where('group_key', tgroup_key)

  res = JSON.stringify(res)
  console.log("res,",res)

  if (JsonIsNull(res) == true) 
  {
    console.log("跑团已存在!请换一个key申请！res:", res)

    ctx.state.data =
      {
        msg: '跑团不存在!key:' + res
      }
  }
  else
  {
    console.log("res:", res);
    var members = res[0].members;
    console.log("members:",members);
    
    var found = null;
    for (var i = 0; i < members.length;i++)
    {
      var item = members[i];
      console.log("item.openid:", item.openid)

      if(item.openid == openid)
      {
        found = item;
        break;
      }
    }

    console.log("found:", found);

    if (found == null) 
    {
      console.log("fail,没有找到用户")

      ctx.state.data =
        {
          msg: 'fail,没有找到用户'
        }
    }
    else
    {
      
      //打卡
      var record = found.record;
      console.log("打卡:", record)
      
      var foundRecordItem = null;
      
      for (var j = 0; j < record.length; j++) {
        var item = record[j];
        if (item.time = todayMD) {
          foundRecordItem = item;
          break;
        }
      }

      if(foundRecordItem == null)
      {
          //如果没有找到,创建一个
        var newRecordItem = {
          "time": GetMD(timestamp),
          "timestamp": timestamp,
          "distance": tdistance
        }
      }

      await mysql("TeamData").update('members', members)

      ctx.state.data =
        {
          msg: 'success'
        }
    }

  }
}

module.exports =
  {
    punch
  }