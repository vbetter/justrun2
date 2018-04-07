const { mysql } = require('../qcloud')


//删
async function testDelete(ctx, next) {
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  // 删
  await mysql("TeamData").del().where('group_key', tgroup_key)

  const body = ctx.request.body

  ctx.state.data =
    {
      msg: 'success'
    }
}

//增
async function testAdd(ctx, next) {
  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key

  var curdate = new Date();
  var timestamp = Date.parse(curdate)
  var key = group_key
  var teams =
    [{
      teamContent: "累计跑步100公里",
      teamIcon: "../../res/ic_groupRed.png",
      teamIndex: "1",
      teamName: "1组",
    },
    {
      teamContent: "累计跑步80公里",
      teamIcon: "../../res/ic_groupBlue.png",
      teamIndex: 2,
      teamName: "2组",
    }
   ];

  var newItem =
    {
    }
  newItem.group_key = key;
  newItem.creator_openid = "123"
  newItem.create_time = timestamp;
  newItem.start_time = timestamp;
  newItem.end_time = timestamp;
  newItem.activeTitle ="活动标题";
  newItem.activeMiniContent = "活动简要";
  newItem.activeContent = "活动详情";
  newItem.teams = JSON.stringify(teams);
  //创建
  await mysql("TeamData").insert(newItem)

  const body = ctx.request.body

  ctx.state.data =
    {
      msg: 'success'
    }
}

//改
async function testSet(ctx, next) {
  // 改
  await mysql("TeamData").update('creator_openid','sss')

  const body = ctx.request.body

  ctx.state.data =
    {
      msg: 'success'
    }
}

//查
async function testGet(ctx, next) {

  var res = await mysql("TeamData").where('group_key', 'lijing')

  console.log("res,", res)

  const body = ctx.request.body

  ctx.state.data =
    {
    msg: 'success'
    }
}

module.exports =
{
  testAdd,
  testDelete,
  testGet,
  testSet
  /*
  console.log(ctx.query)
  console.log(ctx.query.open_id)

  var openid = ctx.query.open_id
  var tgroup_key = ctx.query.group_key
  console.log("tgroup_key:", tgroup_key)

  /*
  if (tgroup_key != null && tgroup_key!= undefined)
  {
    var res = mysql("TeamData").select("group_key")
    if (res == null || res == undefined) {
      console.log("not find key:", tgroup_key)
      var newItem =
        {
          group_key : tgroup_key,
        }
      //创建
      mysql("TeamData").insert(newItem)

      res = mysql("TeamData").where({ tgroup_key }).first()
    }
  }else{
    console.log("group_key is null")
  }
*/
  //console.log("team:",res)

/*
  var res = await mysql("TeamData").where('group_key','lijing')

  console.log("res,",res)


/*
  var curdate = new Date();
  var timestamp = Date.parse(curdate)

  console.log("timestamp:", timestamp)

  var key = "lijing"
  var newItem =
    {
      //start_time: this.timestamp,
      //end_time: "21312312",
      //activeTitle:"title",
      //activeMiniContent:"con",
      //activeContent:"fdsfdsf",
      //create_time: "21312312"
    }
  newItem.group_key = key;
  newItem.creator_openid = "123"
  newItem.start_time = timestamp;
  //创建
  await mysql("TeamData").insert(newItem)
*/
/*
  ctx.state.data =
  {
    //team: res,
    //mydata: ctx.state.data,
    msg:'hello world2'
  }
  */
}