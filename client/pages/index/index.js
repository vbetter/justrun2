//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var userDataManager = require('../../utils/UserDataManager.js')
var timeUtil = require('../../utils/TimeUtil.js')

Page({
    data: {
        enableCreate:false,//能否创建跑团
        activeKey:'',
        array: ['1', '2'],
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        startTime:'',//开始时间
        endTime:'',//结束时间
        startTimeStamp:0,
        endTimeStamp:0,
        isGroup: false, //是否分组createKey
        hasTeam:false,//是否加入跑团
        myAuthority:0,//我的权限
        myGroupIndex:1 //我的分组号
    },
    onShow:function()
    {
      this.updateUI();
    },
    onLoad: function () 
    {
      //var date = new Date('2018-02-21');
      //console.log(date)

      // 页面渲染后 执行
      wx.setNavigationBarTitle({
        title: '个人设置',
      })

      this.login();
    },
    // 用户登录示例
    login: function() {
      
      console.log("logged:",this.data.logged)

        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) 
                {

                  console.log("登录成功1:",result);

                  userDataManager.SetUserInfo(result);

                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })

                    wx.reLaunch({
                      url: '../../pages/index/index',
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) 
                        {
                          if (result.data == null || result.data.data == null)
                          {
                            util.showSuccess('登录失败')
                          } else
                          {
                            console.log('登录成功2:', result.data.data)
                            util.showSuccess('登录成功')
                            that.setData({
                              userInfo: result.data.data,
                              logged: true
                            })
                            userDataManager.SetUserInfo(result.data.data);

                            //拉取跑团数据
                            wx.getStorage({
                              key: 'MyInfo',
                              success: function(res) {
                                console.log("getStorage:res:",res.data);

                                var myInfoJason = JSON.parse(res.data);
                                userDataManager.SetMyInfo(myInfoJason);

                                that.setData({
                                  myGroupIndex: myInfoJason.teamIndex,
                                  activeKey: myInfoJason.group_key
                                })
                                that.findTeam();
                              },
                            })
                          } 

                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
              
                
            }
        })
    },
    bindPickerChange: function (e) {
      var index = parseInt ( e.detail.value) +1;
      console.log('picker发送选择改变，携带值为', index)

      if(index!=this.data.myGroupIndex)
      {
        this.setData({
          myGroupIndex: index
        })

        this.requestSetMyGoupIndex(index);
      }
    },
    //上报我的分组信息
    requestSetMyGoupIndex:function(e)
    {

      if (userDataManager.GetTeamInfo()==null)
      {
        return;
      }

      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.reviseTeamIndex,
        login: true,
        data: {
          group_key: that.data.activeKey,
          open_id: that.data.userInfo.openId,
          teamIndex:e
        },
        success(result) {
          if (result.data != null && result.data.data != null && result.data.data.msg == "success") 
          {
            userDataManager.SetMyTeamIndex(that.data.myGroupIndex)

            util.showSuccess('请求成功完成');
          }
          else {
            util.showModel('请求失败', result.data.data.msg);
          }
        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
      if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },
    /*
    testAdd: function (e) {
      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.testAdd,
        login: true, 
        data: {
          group_key: this.data.activeKey,
          open_id: this.data.userInfo.openId,
        },
        success(result) {
          util.showSuccess('请求成功完成')
          that.setData({
            requestResult: JSON.stringify(result.data)
          })
          //需要刷新本地数据

        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
      if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },
    testDelete: function (e) {
      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.testDelete,
        login: true,
        data: {
          group_key: this.data.activeKey,
          open_id: this.data.userInfo.openId,
        },
        success(result) {
          util.showSuccess('请求成功完成')
          that.setData({
            requestResult: JSON.stringify(result.data)
          })
          //需要刷新本地数据

        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
      if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },
    testSet: function (e) {
      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.testSet,
        login: true, 
        data: {
          group_key: this.data.activeKey,
          open_id: this.data.userInfo.openId,
        },
        success(result) {
          util.showSuccess('请求成功完成')
          that.setData({
            requestResult: JSON.stringify(result.data)
          })
          //需要刷新本地数据

        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
      if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },
    testGet: function (e) {
      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.testGet,
        login: true, 
        data: {
          group_key: this.data.activeKey,
          open_id: this.data.userInfo.openId,
        },
        success(result) {
          util.showSuccess('请求成功完成')
          that.setData({
            requestResult: JSON.stringify(result.data)
          })
          //需要刷新本地数据

        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
      if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },
    */
    bindKeyInput_teamKey:function(e)
    {
        console.log(e)

        var key = e.detail.value;
        this.setData({
          activeKey: key
        })
    },
    bindDateChange_start:function(e)
    {
      var tValue = e.detail.value + " 00:00:00"
      var timestamp = timeUtil.GetTimestampByYMD(tValue);
      console.log(timestamp);

      this.setData(
        {
          startTime: e.detail.value,
          startTimeStamp:timestamp
        }
      )
      
    },
    bindDateChange_end:function(e)
    {
      var tValue = e.detail.value + " 00:00:00"
      var timestamp = timeUtil.GetTimestampByYMD(tValue);
      console.log(timestamp);

      this.setData(
        {
          endTime: e.detail.value,
          endTimeStamp: timestamp
        }
      )
    },
    joinTeam:function(e)
    {
      //加入跑团
      if(this.data.activeKey==null)
      {
        util.showModel('请求失败', '无效的Key');
        return;
      }

      if (this.data.userInfo == null || this.data.userInfo.openId == null) {
        util.showModel('请求失败', '无效用户信息');
      }

      
      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.joinTeam,
        login: true,
        data: {
          group_key: that.data.activeKey,
          open_id: that.data.userInfo.openId,
          username: that.data.userInfo.username,
          teamIndex: that.data.myGroupIndex
        },
        success(result) {

          if (result.data != null && result.data.data != null && result.data.data.msg == "success")
          {
            
            var group = result.data.data.group

            for (var i = 0; i < group.length; i++) {
              var item = group[i];
              if (item.teams != null) group[i].teams = JSON.parse(item.teams);
              if (item.members != null) group[i].members = JSON.parse(item.members);
            }

            console.log("加入跑团成功 ,group:", group)

            userDataManager.SetTeamInfo(group);

            that.setData({
              startTimeStamp: userDataManager.m_teamInfo[0].start_time,
              endTimeStamp: userDataManager.m_teamInfo[0].end_time,
              hasTeam: true
            })

            that.updateUI();

            userDataManager.SaveMyInfo();

            util.showSuccess('请求成功完成');
          }
          else
          {
            console.log(result)
            util.showModel('加入跑团失败', result.data.data.msg);
          }
        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }

      if (this.data.takeSession) 
      {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },

    createTeam:function(e)
    {
      if (util.isEmptyString(this.data.userInfo))
      {
        util.showModel('请求失败', "请先登录")
        return;
      }

      wx.navigateTo({
        url: '../createTeam/createTeam',
      })
    },
    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },
    //切换分组
    switchGroupMode: function (e) {
      this.setData({
        isGroup: e.detail.value
      })
    },
    //离开跑团
    leaveTeam:function()
    {
      console.log("上传用户数据")

      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.leaveTeam,
        login: true,
        data: {
          group_key: this.data.activeKey,
          open_id: this.data.userInfo.openId,
        },
        success(result) {
          if (result.data != null && result.data.data != null && result.data.data.msg == "success")
          {
            that.clearMyInfo();

            that.updateUI();

            wx.removeStorage({
              key: 'MyInfo',
              success: function(res) {},
            })

            util.showSuccess('请求成功完成')
          }
          else
          {
            util.showModel('请求失败', result.data.data.msg);
          }
        },
        fail(error) {
          util.showModel('请求失败', error);
          console.log('request fail', error);
        }
      }
      if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    },
    clearMyInfo:function()
    {
      userDataManager.SetTeamInfo(null);

      this.setData({
        hasTeam: false
      })
    },
    doMyRecord:function(e)
    {
        wx.navigateTo({
          url: '../record/record',
        })
    },
updateUI:function()
{
  var myInfo = userDataManager.GetMyInfo();

  if (myInfo!=null)
  {
    var authority = myInfo != null && myInfo.Authority != null ? myInfo.Authority : 0;

    console.log("authority", authority);

    this.setData({
      activeKey: userDataManager.m_myInfo.ActiveKey,
      isGroup: userDataManager.IsGroup(),
      myAuthority: authority,
      startTime: this.data.startTimeStamp == 0 ? "" : timeUtil.GetMD(this.data.startTimeStamp * 1000),
      endTime: this.data.endTimeStamp == 0 ? "" : timeUtil.GetMD(this.data.endTimeStamp * 1000),
      hasTeam: userDataManager.GetTeamInfo() == null ? false : true,
      myGroupIndex: userDataManager.m_myInfo.MyTeamIndex
    });
  }
  
}
,
onClickActiveContent:function(e)
{
  console.log("onClickActiveContent")

  wx.navigateTo({
    url: '../../pages/rule/rule'
  })

},
findTeam:function()
  {
    //console.log(this.data.userInfo)

    console.log("更新数据 跑团的key:",this.data.activeKey)

    var that = this;
    wx.request({

      url: config.service.findTeam,
      data:{
        group_key: this.data.activeKey,
        open_id: this.data.userInfo.openId,
      },
      success: function (response) {
       

        if (response.data !=null && response.data.data!=null && response.data.data.msg == "success")
        {
          var group = response.data.data.group;

          for (var i = 0; i < group.length;i++)
          {
             var item  = group[i];
             group[i].teams = JSON.parse(item.teams);
             group[i].members = JSON.parse(item.members);
          }
          console.log("更新本地数据:", group)

          userDataManager.SetTeamInfo(group);

          //console.log(userDataManager.m_teamInfo[0].start_time)

          that.setData({
            startTimeStamp: userDataManager.m_teamInfo[0].start_time,
            endTimeStamp: userDataManager.m_teamInfo[0].end_time,
            hasTeam: true
          })

          that.updateUI();

          wx.showToast({
            icon:'success',
            title: '更新成功',
          })
        }else{
          util.showModel('请求失败', response.data.data.msg);

          that.clearMyInfo();
        }
        
      },
      fail: function (err) {
        console.log(err);

        that.clearMyInfo();
      }
    });
  },
})
