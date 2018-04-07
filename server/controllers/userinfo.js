
//打卡
async function punch(ctx, next) 
{
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  var tdistance = ctx.query.distance
  var timestamp = Date.parse(new Date());

  console.log("ctx.query:",ctx.query)

  //先查询有没有这个跑团
  var res = await mysql("TeamData").where('group_key', tgroup_key)
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
    var members = res.members;

    var found = members.find(function (element) {
      return element.openid == openid;
    });

    if (found == null) 
    {
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
      
      var foundRecordItem = record.find(function (element) {
        return element.openid == openid;
      });

      if(foundRecordItem == null)
      {
          //如果没有找到,创建一个
        var newRecordItem = {
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