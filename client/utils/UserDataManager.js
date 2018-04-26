var timeUtil = require('TimeUtil.js')

var m_myInfo =
{
    MyTeamIndex: 1, //我的分组编号，0:未分组  1:1组，2:2组
    ActiveKey :"Test001", //由发起者申请，发给每个组员
    nickname:"",
    open_id:0 //我的openid
}

//队伍信息
var m_teamInfo = [];

/*
var m_teamInfo =
    [{
      "group_key":"Test001",//跑团唯一key
      "creator_openid":"creator_openid",//创建者，团长
      "create_time":"20180402",//创建日期
      "start_time":"1525104000",//活动开始时间
      "end_time":"1525104000",//活动结束时间
      "activeMiniContent" : '4月1日正式开启我们的第二期，第一天望大家都能完成，加油',
     "activeContent" : '分组比赛，比赛规则如下： \n  1. 所有人分成两组 \n 2. 每组一位组长，组长负责每天激励组员跑步，要负责每天汇报本组的跑步情况，管理员负责最后的统计。组长有一个特权，就是可以获得一张免死金牌，可以一次不跑的机会，可以给自己用，也可以给其他人用，这个记录不计入后期输赢的判定  \n  3. 每一组的组长则需要记录两个数字，一为多少人缺席，二为每一天自己组的总公里数； \n 4. 女生生理期三天不算入最后的评分，也不需要罚款  \n 5. 如何判定胜负，到30号那一天哪一组没跑的次数最多的为负方，如果双方没跑的次数一样，则按照所有人跑的总公里数来判定，少的为负方 \n 6. 改为当天打卡，不强迫一定早上跑，不管刮风下雨，自己小组决定要不要跑，反正不跑的要贡献50当作活动经费  \n 7. 负方需要负责第二期线下活动的统筹包括费用支出，活动经费赞助一半',
      "members":
      [
        {
          "openid": "10000",
          "username": "L",
          "teamIndex": 1,
          "Authority": 9,
          "record": [
            {
              "timestamp": 1523000140000,
              "distance": 3.5567
            }
          ]
        }
      ],
      //小组信息
      "teams": [
        {
          "slogan": "fucking run",
          "teamIcon": "../../res/ic_groupRed.png",
          "teamIndex": 1,
          "teamName": "1组"
        },
        {
          "slogan": "fucking run",
          "teamIcon": "../../res/ic_groupBlue.png",
          "teamIndex": 2,
          "teamName": "2组"
        }
      ]
}];
*/

//获取队伍信息
function GetTeamByTeamIndex(teamIndex) {

  if (this.m_teamInfo != null && this.m_teamInfo.length>0)
  {
    var teams = this.m_teamInfo[0].teams;
    if (teams != null || teams != undefined) {
      for (let i = 0; i < teams.length; i++) {
        var item = teams[i];

        if (item.teamIndex == teamIndex) {
          return item;
        }
      }
    }
  }
  return null;
}

//获取所有队伍的信息
function GetAllTeamsInfo() 
{
  if (this.m_teamInfo == null || this.m_teamInfo.length<=0)
  return null;

  var teamInfo = this.m_teamInfo[0].teams

  if (teamInfo!=null && teamInfo.length >0)
  {
    var newTeamInfo = [];

    var members = this.m_teamInfo[0].members
    var toDayMD = timeUtil.GetTodayMD();

  for(var i=0 ;i<teamInfo.length;i++)
  {
     var iTeamInfo = teamInfo[i];

     var totalDistance = 0;//总公里数
     var totalPeople = 0;//总人数
     var totalCompletions =0;//总完成数
     var todayMaxName ="";//今日王者是谁
     var todayMaxDistance =0;//今日王者总公里数
     var todayTotalDistance =0;//今日总公里数

     console.log("members length:", members.length)

     for (var j = 0; j < members.length ;j++)
     {
        var jmember = members[j];

        if (iTeamInfo.teamIndex == jmember.teamIndex) {
          totalPeople++;

        }
        
        for (var s = 0; s < jmember.record.length;s++)
        {
          var srecord = jmember.record[s];
          var sdayMD = timeUtil.GetMD(srecord.timestamp * 1000);

          if (iTeamInfo.teamIndex == jmember.teamIndex)
          {

            totalDistance = totalDistance + srecord.distance;

            if (toDayMD == sdayMD) {
              todayTotalDistance = todayTotalDistance + srecord.distance;
              if (srecord.distance >= 3) {
                totalCompletions++;

                if (srecord.distance > todayMaxDistance)
                {
                  todayMaxName = jmember.username;
                  todayMaxDistance = srecord.distance;
                }
              }
            }
          }
        }
     }
     iTeamInfo.totalDistance = totalDistance;  //总公里数
     iTeamInfo.todayTotalDistance = todayTotalDistance;  //今日总公里数
     iTeamInfo.totalPeople = totalPeople; //总人数
     iTeamInfo.totalCompletions = totalCompletions;//总完成人数
     iTeamInfo.todayMaxName = todayMaxName;
     iTeamInfo.todayMaxDistance = todayMaxDistance;
  }
  }

  console.log("teamInfo:",teamInfo);

  return teamInfo;
}

//设置我的分组
function SetMyTeamIndex(value) 
{
  if (this.m_teamInfo == null || this.m_teamInfo.length <= 0)
    return;

  if (value == null || value ==0)
  return;

  this.m_myInfo.MyTeamIndex = value;
  //修改结构体里面数据
  var myMember = this.m_teamInfo[0].members
  if (myMember != null) {
    //console.log("GetTodayMyPunch-myMember:", myMember)

    for (var i = 0; i < myMember.length; i++) {
      var item = myMember[i];

      //console.log("item.record:", item.record)
      if (item.openid == m_myInfo.open_id) {
        item.teamIndex = value;
      }
    }
  } 
}

function IsGroup()
{
  if (this.m_myInfo.MyTeamIndex==0)
  {return false;}

  return true
}

//获取今日的打卡组信息
function GetGroupTodayInfo(groupIndex)
{
  if (this.m_teamInfo == null || this.m_teamInfo.length <= 0)
    return null;

  var toDayMD = timeUtil.GetTodayMD();
  //console.log("toDayMD:", toDayMD)
  //var myMember = this.GetTeamByTeamIndex(groupIndex);

   var list =[];

   for (var i = 0; i < this.m_teamInfo[0].members.length;i++)
   {
     var item = this.m_teamInfo[0].members[i];
     if (groupIndex == item.teamIndex)
     {
       var newItem = {};
       newItem.username = item.username;
       newItem.openid = item.openid;
       newItem.distance = 0;
       for (var j = 0; j < item.record.length; j++) {
         var jItem = item.record[j];
         var jdayMD = timeUtil.GetMD(jItem.timestamp*1000);
         //console.log("jdayMD:", jdayMD)
         if (toDayMD == jdayMD) {
           console.log("jItem.distance:", jItem.distance)
           newItem.distance = jItem.distance;
         }
       }
       if (newItem.distance > 0) {
         list.push(newItem)
       }
     }
   }

   return list;
}



//获取我的信息
function GetMyInfo()
{
  if (this.m_teamInfo == null || this.m_teamInfo.length <= 0) {
    console.log("m_teamInfo is null");

    return null;
  }

  if (this.m_myInfo == null || this.m_myInfo.open_id == 0 || this.m_myInfo.open_id == null)
  {
    console.log("m_myInfo is null");
    return null;
  }


  var myMember = this.m_teamInfo[0].members
  if (myMember != null) {
    //console.log("GetTodayMyPunch-myMember:", myMember)

    for (var i = 0; i < myMember.length; i++) {
      var item = myMember[i];

      //console.log("item.record:", item.record)
      if (item.openid == m_myInfo.open_id) {
        return item;
      }
    }
  } else {
    console.log("GetTodayMyPunch-myMember is null")
  }

  return null;
}

//当前选择的组
var m_curSelectGroup =0;

//获取我的今日打卡信息
function GetTodayMyPunch() {
  
  if (this.m_teamInfo == null || this.m_teamInfo.length <= 0)
  {
    console.log("m_teamInfo is null");

    return null;
  }

  if (this.m_myInfo == null || this.m_myInfo.open_id == 0 || this.m_myInfo.open_id == null) {
    console.log("m_myInfo is null");
    return null;
  }

  var toDayMD = timeUtil.GetTodayMD();

  var myPunch = { distance:0};

  //console.log("m_myInfo.openid:", m_myInfo.open_id);

  var myMember = this.m_teamInfo[0].members
  if (myMember!=null)
  {
    //console.log("GetTodayMyPunch-myMember:", myMember)

    for (var i = 0; i < myMember.length; i++) {
      var item = myMember[i];

      //console.log("item.record:", item.record)
      if (item.openid == m_myInfo.open_id) {
        for (var j = 0; j < item.record.length; j++) {
          var jItem = item.record[j];
          var jdayMD = timeUtil.GetMD(jItem.timestamp*1000);
          //console.log("jdayMD:", jdayMD, "  toDayMD:", toDayMD)
          if (toDayMD == jdayMD) {
            //console.log("jItem.distance:", jItem.distance)
            myPunch.distance = jItem.distance;
          }
        }
      }
    }
  }else{
    console.log("GetTodayMyPunch-myMember is null")
  }

  return myPunch;
}

function GetMyAllRecords()
{
  if (this.m_teamInfo == null || this.m_teamInfo.length <= 0)
    return null;

  var myMember = this.m_teamInfo[0].members
  if (myMember != null) 
  {
    //console.log("GetTodayMyPunch-myMember:", myMember)

    for (var i = 0; i < myMember.length; i++) {
      var item = myMember[i];
      if (item.openid == m_myInfo.open_id) {
        console.log("item.record:", item.record)
        return item.record;
      }
    }
  }
  return null;
}

function SetTeamInfo(e)
{
  this.m_teamInfo = e;

  if (this.GetTeamInfo()!=null)
  {
    this.m_myInfo.ActiveKey = this.GetTeamInfo().group_key
    if (this.GetMyInfo()!=null)this.m_myInfo.MyTeamIndex = this.GetMyInfo().teamIndex
  }
    
}

function SetUserInfo(e)
{
  console.log("SetUserInfo:", e);

  if (e.nickName!=null)this.m_myInfo.nickname = e.nickName
  if (e.openId!=null)this.m_myInfo.open_id = e.openId;

}

function GetTeamInfo()
{
  if (this.m_teamInfo == null || this.m_teamInfo.length==0)
  return null;

  return this.m_teamInfo[0]
}

function GetTeamLeadInfo()
{
  if (this.m_teamInfo == null || this.m_teamInfo.length == 0)
    return null;

  var creator_openid = this.m_teamInfo[0].creator_openid;
  if (creator_openid!=null)
  {
    var myMember = this.m_teamInfo[0].members
    if (myMember != null) {
      //console.log("GetTodayMyPunch-myMember:", myMember)

      for (var i = 0; i < myMember.length; i++) {
        var item = myMember[i];

        //console.log("item.record:", item.record)
        if (item.openid == creator_openid) {
          return item;
        }
      }
    }
  }
  
  return null;
}

function SetMyInfo(e)
{
    if(e!=null)
    {
      if (e.group_key!=null)this.m_myInfo.ActiveKey = e.group_key
      if (e.teamIndex != null)this.m_myInfo.MyTeamIndex = e.teamIndex
    }
}

//缓存数据
function SaveMyInfo()
{
  var myInfoJason = {};
  myInfoJason.group_key = this.m_myInfo.ActiveKey
  myInfoJason.teamIndex = this.m_myInfo.MyTeamIndex

  wx.setStorage({
    key: 'MyInfo',
    data: JSON.stringify(myInfoJason),
  })
}

//是否能请求无服务器
function IsEnableRequestServer()
{
  if(m_myInfo!=null)
  {
    if (m_myInfo.open_id!=null && m_myInfo.open_id!=0)
    {
      return true;
    }
  }
  return false
}

module.exports =
  {
  IsEnableRequestServer: IsEnableRequestServer,
  SaveMyInfo:SaveMyInfo,
  SetMyInfo: SetMyInfo,
  GetTeamLeadInfo:GetTeamLeadInfo,
  GetTeamInfo: GetTeamInfo,
  GetMyInfo: GetMyInfo,
  GetMyAllRecords: GetMyAllRecords,
  SetUserInfo: SetUserInfo,
  m_teamInfo,
  m_myInfo,
  SetTeamInfo: SetTeamInfo,
    GetTodayMyPunch: GetTodayMyPunch,
    GetGroupTodayInfo: GetGroupTodayInfo,
    SetMyTeamIndex:SetMyTeamIndex,
    GetAllTeamsInfo: GetAllTeamsInfo,
    GetTeamByTeamIndex:GetTeamByTeamIndex,
    IsGroup: IsGroup,
    m_curSelectGroup,
  }