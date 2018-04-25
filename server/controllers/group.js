const { mysql } = require('../qcloud')
var utils  = require('../tools/Utils.js')

//退出跑团
async function leaveTeam(ctx,next)
{
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key

  if (openid == null || tgroup_key == null) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

  //先查询有没有这个跑团
  var res = await mysql("TeamData").where('group_key', tgroup_key)
  if (utils.JsonIsNull(res) == true) {
    console.log("跑团已存在!请换一个key申请！res:", res)

    ctx.state.data =
      {
        msg: '跑团不存在!'
      }
      return;
  }
  //如果我是创建者，退出跑团意味着删除跑团
  if (openid == res[0].creator_openid)
  {
    // 删
    await mysql("TeamData").del().where('group_key', tgroup_key)

    ctx.state.data =
      {
        msg: 'success'
      }

    return;
  }
  else
  {
    //如果我是参与者，退出跑团但保留数据

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

      if (found != null)
      {
        found.state = 8;//1：正常   8：离开

        await mysql("TeamData").where('group_key', tgroup_key).update('members', JSON.stringify(members))

        ctx.state.data =
          {
            msg: 'success'
          }

          return;
      }
  }
  }

  ctx.state.data =
    {
      msg: '未知错误'
    }
}

//创建一个跑团
async function createTeam(ctx,next)
{
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  var startTime = ctx.query.start_time
  var endTime = ctx.query.end_time
  var username = ctx.query.username
  var teamIndex = ctx.query.teamIndex

  if (openid == null || tgroup_key == null || startTime == null || endTime == null || username == null || teamIndex ==null) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

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
    newItem.state = 1;//1：正常   8：离开
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
    newItem.activeTitle = "30天约跑";
    newItem.activeMiniContent = "活动简要";
    newItem.activeContent = '分组比赛，比赛规则如下： \n  1. 所有人分成两组 \n 2. 每组一位组长，组长负责每天激励组员跑步，要负责每天汇报本组的跑步情况，管理员负责最后的统计。组长有一个特权，就是可以获得一张免死金牌，可以一次不跑的机会，可以给自己用，也可以给其他人用，这个记录不计入后期输赢的判定  \n  3. 每一组的组长则需要记录两个数字，一为多少人缺席，二为每一天自己组的总公里数； \n 4. 女生生理期三天不算入最后的评分，也不需要罚款  \n 5. 如何判定胜负，到30号那一天哪一组没跑的次数最多的为负方，如果双方没跑的次数一样，则按照所有人跑的总公里数来判定，少的为负方 \n 6. 改为当天打卡，不强迫一定早上跑，不管刮风下雨，自己小组决定要不要跑，反正不跑的要贡献50当作活动经费  \n 7. 负方需要负责第二期线下活动的统筹包括费用支出，活动经费赞助一半';
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

  if (openid == null || tgroup_key == null ) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

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

  if (openid == null || tgroup_key == null || username == null || teamIndex == null) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

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
        newItem.state = 1;//1：正常   8：离开
        newItem.record = [];

        members.push(newItem);

        console.log("======>members:", members)

        await mysql("TeamData").where('group_key', tgroup_key).update('members', JSON.stringify(members))
      }else{
        if (found.state!=1)
        {
          found.state = 1;//1：正常   8：离开

          await mysql("TeamData").where('group_key', tgroup_key).update('members', JSON.stringify(members))
        }
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

//修改跑团数据
async function reviseTeam(ctx, next) {

  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key

  var startTime = ctx.query.start_time
  var endTime = ctx.query.end_time
  var activeContent = ctx.query.activeContent

  if (openid == null || tgroup_key == null || startTime == null || endTime == null) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

  var res = await mysql("TeamData").where('group_key', tgroup_key)
  console.log(res);
  //检查跑团是否存在
  if (utils.JsonIsNull(res) == true) {
    ctx.state.data =
      {
        msg: '跑团信息不存在'
      }

      return;
  }
  //团长才能修改跑团数据
  
  if (openid == res[0].creator_openid)
  {
    await mysql("TeamData").where('group_key', tgroup_key).update(
      {
        'start_time': startTime, 
        "end_time": endTime, 
        "activeContent": activeContent
      }
    )

    //查询
    var res2 = await mysql("TeamData").where('group_key', tgroup_key)

    if (res != null) {
      ctx.state.data = {};
      ctx.state.data.group = res2;
      ctx.state.data.msg = "success";
    } else {
      ctx.state.data =
        {
          msg: 'res is null'
        }
    }

    return;
  }

  ctx.state.data =
    {
      msg: '未知错误'
    }
}


module.exports =
  {
    reviseTeam,
    leaveTeam,
    createTeam,
    joinTeam,
    findTeam
  }