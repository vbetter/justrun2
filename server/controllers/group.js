const { mysql } = require('../qcloud')
var utils  = require('../tools/Utils.js')


//创建一个跑团
async function createGroup(ctx,next)
{
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  //先查询有没有这个跑团
  var res = await mysql("TeamData").where('group_key', tgroup_key)
  if (utils.JsonIsNull(res) == false)
  {
    console.log("跑团已存在!请换一个key申请！res:",res)

    ctx.state.data =
      {
        group: null,
        msg: '跑团已存在!请换一个key申请！'
      }
  }else{
    var curdate = new Date();
    var timestamp = Date.parse(curdate)

    var teams =
      [{
        "teamContent": "累计跑步100公里",
        "teamIcon": "../../res/ic_groupRed.png",
        "teamIndex": "1",
        "teamName": "1组"
      },
      {
        "teamContent": "累计跑步80公里",
        "teamIcon": "../../res/ic_groupBlue.png",
        "teamIndex": "2",
        "teamName": "2组"
      }
      ]

      

    var members = 
      [
      {
        "openid": openid,
        "username": "L",
        "teamIndex": "1",
        "Authority": "9",
        "record": [
          {
            "time": GetMD(1523000140000),
            "timestamp": 1523000140000,
            "distance": 3.5567
          }, {
            "time": GetMD(1523000140000),
            "timestamp": 1523000140000,
            "distance": 4
          }, {
            "time": GetMD(1523000140000),
            "timestamp": 1523000140000,
            "distance": 5
          }
        ]
      }
    ]

    var newItem =
      {
      }
    newItem.group_key = tgroup_key;
    newItem.creator_openid = openid
    newItem.create_time = timestamp;
    newItem.start_time = timestamp;
    newItem.end_time = timestamp;
    newItem.activeTitle = "活动标题";
    newItem.activeMiniContent = "活动简要";
    newItem.activeContent = "活动详情";
    newItem.teams = JSON.stringify(teams);
    newItem.members = JSON.stringify(members);
    //var jsonItem = JSON.stringify(newItem);
    console.log("====== new item:",newItem)

    //创建
    await mysql("TeamData").insert(newItem)

    //查询
    var res = await mysql("TeamData").where('group_key', tgroup_key)
    console.log("=======>查询:",res);

    ctx.state.data = {}
    ctx.state.data.group = res;
    ctx.state.data.msg = "success";
  }
}

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

//获取我的跑团信息
async function getMyGroupInfo(ctx, next) 
{

  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key

  var res = await mysql("TeamData").where('group_key', tgroup_key)
  console.log(res);

  if (utils.JsonIsNull(res) == true)
  {
    ctx.state.data = 
    {
    }
    ctx.state.data.group = null;
    ctx.state.data.msg = "拉取数据失败，跑团信息不存在。key:" + tgroup_key;
  }
  else
  {

    ctx.state.data = {};
    ctx.state.data.group = res;
    ctx.state.data.msg = "success";
  }

}

//加入跑团
async function addGroup(ctx, next) {

  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key

  var res = await mysql("TeamData").where('group_key', tgroup_key)
  console.log(res);

  if (utils.JsonIsNull(res) == true) {
    ctx.state.data =
      {
      }
    ctx.state.data.group = null;
    ctx.state.data.msg = "拉取数据失败，跑团信息不存在。key:" + tgroup_key;
  }
  else {
    /*
    ctx.state.data = {};
    ctx.state.data.group = res;
    ctx.state.data.msg = "success";
    */

  }
}

module.exports =
  {
    createGroup,
    addGroup,
    getMyGroupInfo
  }