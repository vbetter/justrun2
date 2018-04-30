const { mysql } = require('../qcloud')
var utils  = require('../tools/Utils.js')

//退出跑团
async function leaveTeam(ctx,next)
{
  var openid = ctx.query.open_id
  var tteam_key = ctx.query.team_key

  if (openid == null || tteam_key == null) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

  //先查询有没有这个跑团
  var res = await mysql("TeamData").where('team_key', tteam_key)
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
    var mysqlResult = await mysql("TeamData").del().where('team_key', tteam_key)
    console.log("mysqlResult:", mysqlResult)
    if (mysqlResult==1)
    {
      ctx.state.data =
        {
          msg: 'success'
        }
      return;
    }
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

        await mysql("TeamData").where('team_key', tteam_key).update('members', JSON.stringify(members))

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
  var tteam_key = ctx.query.team_key
  var startTime = ctx.query.start_time
  var endTime = ctx.query.end_time
  var username = ctx.query.username
  var team_count = ctx.query.team_count
  var team_name = ctx.query.team_name
  var activeContent = ctx.query.activeContent
  var minKM = ctx.query.minKM

  if (openid == null || tteam_key == null || startTime == null || endTime == null || username == null || team_count ==null
    || startTime == 0 || endTime == 0 || minKM == null
  ) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }
  if (team_count <= 0) team_count =1;

  //先查询有没有这个跑团
  var res = await mysql("TeamData").where('team_key', tteam_key)
  if (utils.JsonIsNull(res) == false)
  {
    console.log("跑团已存在!请换一个key申请！res:",res)

    ctx.state.data =
      {
      msg: '跑团已存在!'
      }
      return;
  }else{
    
    var create_time = utils.GetTimeStamp();
    var teams =[];

    for (var i = 0; i < team_count;i++)
    {
        var tTeamIndex = i+1;
        var newTeamItem = {};
        newTeamItem.teamIndex = tTeamIndex;
        newTeamItem.teamIcon = GetTeamIcon(tTeamIndex);
        newTeamItem.teamName = tTeamIndex+"组";
        teams.push(newTeamItem)
    }

    var members = []
    var newItem = {}
    newItem.openid = openid;
    newItem.username = username;
    newItem.teamIndex = 1;
    newItem.Authority = "9";//最高权限
    newItem.state = 1;//1：正常   8：离开
    newItem.record = [];

    members.push(newItem);


    var newItem =
      {
      }
      
    newItem.team_key = tteam_key;
    newItem.creator_openid = openid
    newItem.team_count = team_count;
    newItem.start_time = startTime;
    newItem.end_time = endTime;
    newItem.team_name = team_name;
    newItem.activeContent = activeContent;
    newItem.create_time = create_time;
    newItem.teams = JSON.stringify(teams);
    newItem.members = JSON.stringify(members);
    newItem.minKM = minKM;

    console.log("====== new item:",newItem)

    //创建
    await mysql("TeamData").insert(newItem);

    console.log("====== createResult:")

    //查询
    var res = await mysql("TeamData").where('team_key', tteam_key)
    console.log("=======>查询:",res);

    if (utils.JsonIsNull(res)== false)
    {
      ctx.state.data = {}
      ctx.state.data.group = res;
      ctx.state.data.msg = "success";
      return;
    }
  }

  ctx.state.data =
    {
      msg: '数据异常'
    }
}

function GetTeamIcon(index)
{
  var iconName ="../../res/ic_groupRed.png";
  switch(index)
  {
    case 1:
      iconName = "../../res/ic_groupRed.png";
    break;
    case 2:
      iconName = "../../res/ic_groupBlue.png";
      break;
    case 3:
      iconName = "../../res/ic_groupBlue.png";
      break;
    default:
    break;
  }

  return iconName;
}

//查找跑团信息
async function findTeam(ctx, next) {

  var openid = ctx.query.open_id
  var tteam_key = ctx.query.team_key

  if (openid == null || tteam_key == null ) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

  var res = await mysql("TeamData").where('team_key', tteam_key)
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
    return;
  }
  ctx.state.data =
    {
      msg: '数据异常'
    }
}

//加入跑团
async function joinTeam(ctx, next) {

  var openid = ctx.query.open_id
  var tteam_key = ctx.query.team_key
  var username = ctx.query.username
  var teamIndex = ctx.query.teamIndex

  if (openid == null || tteam_key == null || username == null || teamIndex == null) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

  var res = await mysql("TeamData").where('team_key', tteam_key)
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

        await mysql("TeamData").where('team_key', tteam_key).update('members', JSON.stringify(members))
      }else{
        if (found.state!=1)
        {
          found.state = 1;//1：正常   8：离开

          await mysql("TeamData").where('team_key', tteam_key).update('members', JSON.stringify(members))
        }
      }

      //查询
      var res2 = await mysql("TeamData").where('team_key', tteam_key)

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
  var tteam_key = ctx.query.team_key

  var startTime = ctx.query.start_time
  var endTime = ctx.query.end_time
  var activeContent = ctx.query.activeContent
  var team_name = ctx.query.team_name
  var minKM = ctx.query.minKM;

  if (openid == null || tteam_key == null || startTime == null || endTime == null || team_name == null || activeContent ==null
    || minKM == null
  ) {
    ctx.state.data =
      {
        msg: '上报参数错误'
      }
    return;
  }

  var res = await mysql("TeamData").where('team_key', tteam_key)
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
     var requestResult= await mysql("TeamData").where('team_key', tteam_key).update(
      {
        start_time: startTime, 
        end_time: endTime, 
        team_name: team_name,
        minKM: minKM,
        activeContent: activeContent
      }
    )

     console.log("requestResult:", requestResult);

    //查询
    var res2 = await mysql("TeamData").where('team_key', tteam_key)

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