const { mysql } = require('../qcloud')
var utils  = require('../tools/Utils.js')


//创建一个跑团
async function createTeam(ctx,next)
{
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  var startTime = ctx.query.start_time
  var endTime = ctx.query.end_time
  var username = ctx.query.username
  var teamIndex = ctx.query.teamIndex

  //先查询有没有这个跑团
  var res = await mysql("TeamData").where('group_key', tgroup_key)
  if (utils.JsonIsNull(res) == false)
  {
    console.log("跑团已存在!请换一个key申请！res:",res)

    ctx.state.data =
      {
      msg: '跑团已存在!'
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

      

    var members = []
    var newItem = {}
    newItem.openid = openid;
    newItem.username = username;
    newItem.teamIndex = teamIndex;
    newItem.Authority = "9";//最高权限
    newItem.record = [];

    members.push(newItem);


    var newItem =
      {
      }
    newItem.group_key = tgroup_key;
    newItem.creator_openid = openid
    newItem.create_time = timestamp;
    newItem.start_time = startTime;
    newItem.end_time = endTime;
    newItem.activeTitle = "活动标题";
    newItem.activeMiniContent = "活动简要";
    newItem.activeContent = "活动详情";
    newItem.teams = JSON.stringify(teams);
    newItem.members = JSON.stringify(members);
    
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

//查找跑团信息
async function findTeam(ctx, next) {

  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key

  var res = await mysql("TeamData").where('group_key', tgroup_key)
  console.log(res);

  if (utils.JsonIsNull(res) == true) {
    ctx.state.data =
      {
        msg: '跑团信息不存在'
      }
  }
  else {

    ctx.state.data = {};
    ctx.state.data.group = res;
    ctx.state.data.msg = "success";
  }

}

//加入跑团
async function joinTeam(ctx, next) {

  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  var username = ctx.query.username
  var teamIndex = ctx.query.teamIndex

  var res = await mysql("TeamData").where('group_key', tgroup_key)
  console.log("joinTeam- find res:",res);

  if (utils.JsonIsNull(res) == true) {
    ctx.state.data =
      {
        msg: '跑团信息不存在'
      }
  }
  else {
    var members = JSON.parse(res[0].members);
    if (members != null) {
      var found = null;
      for (var i = 0; i < members.length; i++) {
        var item = members[i];
        console.log("item.openid:", item.openid)

        if (item.openid == openid) {
          found = item;
          break;
        }
      }

      if (found==null)
      {
        var newItem = {}
        newItem.openid = openid;
        newItem.username = username;
        newItem.teamIndex = teamIndex;
        newItem.Authority = "1";
        newItem.record = [];

        members.push(newItem);

        console.log("======>members:", members)

        await mysql("TeamData").where('group_key', tgroup_key).update('members', JSON.stringify(members))
      }

      //查询
      var res2 = await mysql("TeamData").where('group_key', tgroup_key)

      if(res!=null)
      {
        ctx.state.data = {};
        ctx.state.data.group = res2;
        ctx.state.data.msg = "success";
      }else{
        ctx.state.data =
          {
            msg: 'res is null'
          }
      }

    }
    else {
      ctx.state.data =
        {
          msg: 'members is null'
        }
    }
  }
}

module.exports =
  {
    createGroup,
    joinTeam,
    getMyGroupInfo
  }