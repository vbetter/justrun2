var timeUtil = require('TimeUtil.js')

var m_myInfo =
{
    MyTeamIndex: 1, //我的分组编号，0:未分组  1:1组，2:2组
    ActiveKey :"Test001", //由发起者申请，发给每个组员
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
      "activeTitle":'30天约跑',//主界面标题
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

  if (m_teamInfo != null && m_teamInfo.length>0)
  {
    var teams = m_teamInfo[0].teams;
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
function GetTeamInfo() 
{
  if (m_teamInfo == null || m_teamInfo.length<=0)
  return null;

  var timestamp = Date.parse(new Date());
  var teamInfo = m_teamInfo[0].teams
  var members = m_teamInfo[0].members
  var toDayMD = timeUtil.GetMD(timestamp);

  console.log("GetTeamInfo-members:",members);

  if (teamInfo!=null)
  {
  for(var i=0 ;i<teamInfo.length;i++)
  {
     var iTeamInfo = teamInfo[i];
     var totalDistance = 0;//总公里数
     var totalPeople = 0;//总人数
     var totalCompletions =0;//总完成数
     var todayMaxName ="";//今日王者是谁
     var todayMaxDistance =0;//今日王者总公里数



     for (var j = 0; j < members.length ;j++)
     {
        var jmember = members[j];
        for (var s = 0; s < jmember.record.length;s++)
        {
          var srecord = jmember.record[s];
          var sdayMD = timeUtil.GetMD(srecord.timestamp);
          if(toDayMD == sdayMD)
          {
            totalDistance = totalDistance + srecord.distance;
            if(srecord.distance>=3)
            {
              totalCompletions++;
            }
          }

          if (iTeamInfo.teamIndex == jmember.teamIndex)
          {
            totalPeople++;
          }
        }
     }
     iTeamInfo.totalDistance = totalDistance;  //总公里数
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
function SetMyTeamIndex(value) {

  m_myInfo.MyTeamIndex = value;
}

function GetMyTeamIndex()
{
  return m_myInfo.MyTeamIndex;
}

function GetActiveKey()
{
  return m_myInfo["ActiveKey"];// m_teamInfo[0].group_key;
}

function IsGroup()
{
  if (m_myInfo.MyTeamIndex==0)
  {return false;}

  return true
}

function ActiveMiniContent()
{
  if (m_teamInfo == null || m_teamInfo.length <= 0)
    return null;

  return m_teamInfo[0].activeMiniContent;
}

function ActiveTitle() {
  if (m_teamInfo == null || m_teamInfo.length <= 0)
    return null;

  return m_teamInfo[0].activeTitle;
}

function ActiveContent()
{
  if (m_teamInfo == null || m_teamInfo.length <= 0)
    return null;

  return m_teamInfo[0].activeContent;
}

function GetGroupTodayInfo(groupIndex)
{
  if (m_teamInfo == null || m_teamInfo.length <= 0)
    return null;

  var timestamp = Date.parse(new Date());
  var toDayMD = timeUtil.GetMD(timestamp);
  //console.log("toDayMD:", toDayMD)
  //var myMember = this.GetTeamByTeamIndex(groupIndex);

   var list =[];

   for(var i=0 ;i<m_teamInfo[0].members.length;i++)
   {
     var item = m_teamInfo[0].members[i];
     if(m_myInfo.MyTeamIndex == item.teamIndex)
     {
       var newItem = {};
       newItem.username = item.username;
       newItem.openid = item.openid;
       newItem.distance = 0;
       for (var j = 0; j < item.record.length; j++) {
         var jItem = item.record[j];
         var jdayMD = timeUtil.GetMD(jItem.timestamp);
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

//当前选择的组
var m_curSelectGroup =0;

//获取我的今日打卡信息
function GetTodayMyPunch() {
  if (m_teamInfo == null || m_teamInfo.length <= 0)
    return null;
    
  var timestamp = Date.parse(new Date());
  var toDayMD = timeUtil.GetMD(timestamp);

  var myPunch = { distance:0};

  //console.log("m_myInfo.openid:", m_myInfo.open_id);

  var myMember = m_teamInfo[0].members
  if (myMember!=null)
  {
    //console.log("GetTodayMyPunch-myMember:", myMember)

    for (var i = 0; i < myMember.length; i++) {
      var item = myMember[i];

      //console.log("item.record:", item.record)
      if (item.openid == m_myInfo.open_id) {
        for (var j = 0; j < item.record.length; j++) {
          var jItem = item.record[j];
          var jdayMD = timeUtil.GetMD(jItem.timestamp);
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

function SetTeamInfo(e)
{
  m_teamInfo = e;
}

function SetUserInfo(e)
{
  m_myInfo.open_id = e.openId;

}

module.exports =
  {
  SetUserInfo: SetUserInfo,
  m_teamInfo,
  m_myInfo,
  SetTeamInfo: SetTeamInfo,
    GetTodayMyPunch: GetTodayMyPunch,
    GetGroupTodayInfo: GetGroupTodayInfo,
    SetMyTeamIndex:SetMyTeamIndex,
    GetTeamInfo:GetTeamInfo,
    GetTeamByTeamIndex:GetTeamByTeamIndex,
    ActiveMiniContent:ActiveMiniContent,
    IsGroup: IsGroup,
    GetActiveKey: GetActiveKey,
    GetMyTeamIndex:GetMyTeamIndex,
    ActiveTitle:ActiveTitle,
    ActiveContent:ActiveContent,
    m_curSelectGroup,
  }