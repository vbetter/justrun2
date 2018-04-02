var IsGroup = true;//是否分组

var MyTeamIndex = 1;//我的分组编号，0为1组，1为2组


var ActiveKey ="Test001";//由发起者申请，发给每个组员

var ActiveTitle ='30天约跑'
var ActiveMiniContent ='4月1日正式开启我们的第二期，第一天望大家都能完成，加油'
var ActiveContent = '分组比赛，比赛规则如下： \n  1. 所有人分成两组 \n 2. 每组一位组长，组长负责每天激励组员跑步，要负责每天汇报本组的跑步情况，管理员负责最后的统计。组长有一个特权，就是可以获得一张免死金牌，可以一次不跑的机会，可以给自己用，也可以给其他人用，这个记录不计入后期输赢的判定  \n  3. 每一组的组长则需要记录两个数字，一为多少人缺席，二为每一天自己组的总公里数； \n 4. 女生生理期三天不算入最后的评分，也不需要罚款  \n 5. 如何判定胜负，到30号那一天哪一组没跑的次数最多的为负方，如果双方没跑的次数一样，则按照所有人跑的总公里数来判定，少的为负方 \n 6. 改为当天打卡，不强迫一定早上跑，不管刮风下雨，自己小组决定要不要跑，反正不跑的要贡献50当作活动经费  \n 7. 负方需要负责第二期线下活动的统筹包括费用支出，活动经费赞助一半'

//队伍信息
var m_teamInfo =
    {
      "key":"testkey001",//跑团唯一key
      "creator_openid":"creator_openid",//创建者，团长
      "creae_date":"20180402",//创建日期
      //小组信息
      "teams": [
        {
          "teamContent": "累计跑步100公里",
          "teamIcon": "../../res/ic_groupRed.png",
          "teamIndex": "1",
          "teamName": "1组",
          //组员数据
          member: [
            {
              "openid": "10000",
              "username": "L",
              record: [
                {
                  date: "4.1",
                  distance: 3
                }, {
                  date: "4.2",
                  distance: 4
                }, {
                  date: "4.3",
                  distance: 5
                }
              ]
            },
            {
              "openid": "10001",
              "username": "KKK",
              record: [
                {
                  date: "4.1",
                  distance: 3
                }, {
                  date: "4.2",
                  distance: 4
                }, {
                  date: "4.3",
                  distance: 5
                }
              ]
            }
          ]
        },
        {
          "teamContent": "累计跑步80公里",
          "teamIcon": "../../res/ic_groupBlue.png",
          "teamIndex": 2,
          "teamName": "2组",
          //组员数据
          member: [
            {
              "openid": "10000",
              "username": "L",
              record: [
                {
                  date: "4.1",
                  distance: 3
                }, {
                  date: "4.2",
                  distance: 4
                }, {
                  date: "4.3",
                  distance: 5
                }
              ]
            },
            {
              "openid": "10001",
              "username": "KKK",
              record: [
                {
                  date: "4.1",
                  distance: 3
                }, {
                  date: "4.2",
                  distance: 4
                }, {
                  date: "4.3",
                  distance: 5
                }
              ]
            }
          ]
        }
      ]
};


//获取队伍信息
function GetTeamByTeamIndex(teamIndex) {
  var teams = m_teamInfo.teams;
  if (teams != null || teams!=undefined)
  {
    for (let i = 0; i < teams.length; i++) {
      var item = teams[i];
      if (item.teamIndex == teamIndex) {
         return item;
      }
    }
  }
  return null;
}

//获取队伍的总公里数
function GetTotalDistanceByTeamIndex(teamIndex)
{
  var diatance =0;
  for (let i = 0; i < m_allPlayers.length; i++) {
    var item = m_allPlayers[i];
    if (item.teamIndex == teamIndex) {
      diatance = diatance + item.diatance;
    }
  }
  return diatance;
}

//获取队伍的信息
function GetTeamInfo() {

  return m_teamInfo;
}

function SetActiveGroup(value) {
  IsGroup = value;
}

function SetMyTeamIndex(value) {
  if (value == 0)
    return;

  MyTeamIndex = value;
}

function GetMyTeamIndex()
{
  return MyTeamIndex;
}

function GetActiveKey()
{
  return ActiveKey;
}

function IsGroup()
{
  if (MyTeamIndex==0)
  {return false;}

  return true
}

module.exports =
  {
    SetMyTeamIndex:SetMyTeamIndex,
    GetTeamInfo:GetTeamInfo,
    GetTotalDistanceByTeamIndex:GetTotalDistanceByTeamIndex,
    GetTeamByTeamIndex:GetTeamByTeamIndex,
    ActiveMiniContent:ActiveMiniContent,
    IsGroup: IsGroup,
    GetActiveKey: GetActiveKey,
    GetMyTeamIndex:GetMyTeamIndex,
    SetActiveGroup:SetActiveGroup,
    ActiveTitle:ActiveTitle,
    ActiveContent:ActiveContent,
  }