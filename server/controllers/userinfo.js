const { mysql } = require('../qcloud')
var utils = require('../tools/Utils.js')

//打卡
async function punch(ctx, next) 
{
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  var tdistance = ctx.query.distance
  
  var punch_timestamp = ctx.query.punch_timestamp
  var tpunchDate = utils.GetYMD(punch_timestamp * 1000);//转换成格式:2018-04-25

  //先查询有没有这个跑团
  var res = await mysql("TeamData").where('group_key', tgroup_key)

  console.log("====res,",res)

  if (utils.JsonIsNull(res) == true) 
  {
    console.log("跑团已存在!请换一个key申请！res:", res)

    ctx.state.data =
      {
        msg: '跑团不存在!key:' + res
      }
  }
  else
  {
    //检测打卡时间是否在活动区间
    var start_timestamp = parseInt(res[0].start_time);
    var end_timestamp = parseInt(res[0].end_time);
    
    if (punch_timestamp >= start_timestamp && punch_timestamp <= end_timestamp)
    {
      console.log("=====> res:", res);
      var members = JSON.parse(res[0].members);

      var found = null;
      for (var i = 0; i < members.length; i++) {
        var item = members[i];
        console.log("item.openid:", item.openid)

        if (item.openid == openid) {
          found = item;
          break;
        }
      }

      console.log("=====>found:", found);

      if (found == null) {
        console.log("-----fail,没有找到用户")

        ctx.state.data =
          {
            msg: '用户不存在'
          }
      }
      else {

        //打卡
        var record = found.record;
        console.log("打卡:", record)

        var foundRecordItem = null;

        for (var j = 0; j < record.length; j++) {
          var item = record[j];
          if (item.time == tpunchDate) {
            foundRecordItem = item;
            break;
          }
        }

        if (foundRecordItem == null) {
          console.log("======>没有打卡，创建一个新记录", members)
          //如果没有找到,创建一个
          var newRecordItem = {
            "time": tpunchDate,
            "timestamp": punch_timestamp,
            "distance": parseFloat(tdistance)
          }
          record.push(newRecordItem)
        }else{
          foundRecordItem.timestamp = punch_timestamp
          foundRecordItem.distance = parseFloat(tdistance)
        }

        console.log("======>members:", members)

        await mysql("TeamData").where('group_key', tgroup_key).update('members', JSON.stringify(members))

        //查询
        var res = await mysql("TeamData").where('group_key', tgroup_key)

        ctx.state.data = {}
        ctx.state.data.group = res;
        ctx.state.data.msg = "success";
      }
    }
    else
    {
      console.log("不在活动区间内 start_timestamp : %c end_timestamp：%c punch_timestamp：%c", start_timestamp, end_timestamp, punch_timestamp);

      ctx.state.data =
        {
        msg: '不在活动区间内'
        }
    }

    

  }
}

module.exports =
  {
    punch
  }