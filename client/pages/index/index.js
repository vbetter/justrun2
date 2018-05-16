//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var userDataManager = require('../../utils/UserDataManager.js')
var timeUtil = require('../../utils/TimeUtil.js')

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

Page({
    data: {
        enableCreate:false,//能否创建跑团
        team_key:'',
        array: [1, 2],
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

      var that = this;
      
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {

            // 检查登录是否过期
            wx.checkSession({
              success: function () {
                // 登录态未过期
                showSuccess('登录成功');
                console.log('bindGetUserInfo 登录成功');

                that.doLogin()
              },

              fail: function () {
                qcloud.clearSession();
                
              },
            });
          } else {
            console.log('用户未授权');
          }
        }
      });
      
    },
    doLogin() {
      var that = this;
      
      showBusy('正在登录');

      // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
      qcloud.login({
        success(result) {
          showSuccess('登录成功');
          console.log('doLogin 登录成功', result);

          userDataManager.SetUserInfo(result);

          util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })

/*
          wx.reLaunch({
            url: '../../pages/index/index',
          })
          */
        },

        fail(error) {
          showModel('登录失败', error);
          console.log('doLogin 登录失败', error);
        }
      });
    },
    bindGetUserInfo: function (e) {

      showBusy('正在登录');

      var that = this;
      var userInfo = e.detail.userInfo;

      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {

            // 检查登录是否过期
            wx.checkSession({
              success: function () {
                // 登录态未过期
                showSuccess('登录成功');
                console.log('bindGetUserInfo 登录成功', userInfo);

                that.doLogin()
              },

              fail: function () {
                qcloud.clearSession();
                // 登录态已过期，需重新登录
                var options = {
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv,
                  userInfo: userInfo
                }
                that.getWxLogin(options);
              },
            });
          } else {
            showModel('用户未授权', e.detail.errMsg);
          }
        }
      });
    },
    getWxLogin: function (options) {
      var that = this;

      wx.login({
        success: function (loginResult) {
          var loginParams = {
            code: loginResult.code,
            encryptedData: options.encryptedData,
            iv: options.iv,
          }
          qcloud.requestLogin({
            loginParams, success() {
              showSuccess('登录成功');
              console.log('登录成功', options.userInfo);

              that.doLogin()
            },
            fail(error) {
              showModel('登录失败', error)
              console.log('登录失败', error)
            }
          });
        },
        fail: function (loginError) {
          showModel('登录失败', loginError)
          console.log('登录失败', loginError)
        },
      });
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
                                  team_key: myInfoJason.team_key
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

      if (index > userDataManager.m_myInfo.team_count)
      {
        util.showModel('请求失败', "设置分组错误,小组数量为:" + userDataManager.m_myInfo.team_count);
        return;
      }

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

      if (userDataManager.IsEnableRequestServer() == false) {
        util.showModel('请求失败', "微信登录失败，缺少openid")
        return;
      }

      if (this.data.team_key==null)
      {
        return;
      }

      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.reviseTeamIndex,
        login: true,
        data: {
          team_key: that.data.team_key,
          open_id: that.data.userInfo.openId,
          teamIndex: e
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
    bindKeyInput_teamKey:function(e)
    {
        console.log(e)

        var key = e.detail.value;
        this.setData({
          team_key: key
        })
    },
    joinTeam:function(e)
    {
      if (userDataManager.IsEnableRequestServer() == false) {
        util.showModel('请求失败', "微信登录失败，缺少openid")
        return;
      }

      if(this.data.team_key==null)
      {
        util.showModel('请求失败', '无效的Key');
        return;
      }

      if (userDataManager.m_myInfo.username == null) {
        util.showModel('请求失败', '无效用户信息');
        return;
      }
      
      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.joinTeam,
        login: true,
        data: {
          team_key: that.data.team_key,
          open_id: userDataManager.m_myInfo.open_id,
          username: userDataManager.m_myInfo.username,
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

      if (userDataManager.IsEnableRequestServer() == false) {
        util.showModel('请求失败', "微信登录失败，缺少openid")
        return;
      }

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

      if (userDataManager.IsEnableRequestServer() == false) {
        util.showModel('请求失败', "微信登录失败，缺少openid")
        return;
      }

      if (this.data.team_key == null) {
        util.showModel('请求失败', '无效的Key');
        return;
      }


      if (userDataManager.GetTeamInfo().creator_openid == userDataManager.m_myInfo.open_id)
      {
        var that = this;
       wx.showModal({
         title: '提示',
         content: '你是团长，退出跑团意味着解散！',
         success: function (res) {
           if (res.confirm) {
             that.requestLeaveTeam();
           } else if (res.cancel) {
             console.log('用户点击取消')
           }
         }
       })   
      }
      else
      {
        this.requestLeaveTeam();
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

  if (userDataManager.m_myInfo!=null)
  {
      var list = [];
      if (userDataManager.m_myInfo.team_count>=1)
      {
        for (var i = 0; i < userDataManager.m_myInfo.team_count; i++) {
          list.push(i+1);
        }

        this.setData({
          array: list
        });
      }
  }

  var myInfo = userDataManager.GetMyInfo();

  if (myInfo!=null)
  {
    var authority = myInfo != null && myInfo.Authority != null ? myInfo.Authority : 0;

    console.log("authority", authority);

    this.setData({
      team_key: userDataManager.m_myInfo.team_key,
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

requestLeaveTeam: function () {
  util.showBusy('请求中...')
  var that = this
  var options = {
    url: config.service.leaveTeam,
    login: true,
    data: {
      team_key: this.data.team_key,
      open_id: this.data.userInfo.openId,
    },
    success(result) {
      if (result.data != null && result.data.data != null && result.data.data.msg == "success") {
        that.clearMyInfo();

        that.updateUI();

        wx.removeStorage({
          key: 'MyInfo',
          success: function (res) { },
        })

        util.showSuccess('请求成功完成')
      }
      else {
        util.showModel('请求失败', result.data.data.msg);

        that.clearMyInfo();
      }
    },
    fail(error) {
      util.showModel('请求失败', error);
      console.log('request fail', error);

      that.clearMyInfo();
    }
  }
  if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
    qcloud.request(options)
  } else {    // 使用 wx.request 则不带登录态
    wx.request(options)
  }
},
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

    console.log("更新数据 跑团的key:",this.data.team_key)

    var that = this;
    wx.request({

      url: config.service.findTeam,
      data:{
        team_key: this.data.team_key,
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

          wx.removeStorage({
            key: 'MyInfo',
            success: function (res) { },
          })

          that.clearMyInfo();
        }
        
      },
      fail: function (err) {
        console.log(err);

        wx.removeStorage({
          key: 'MyInfo',
          success: function (res) { },
        })

        that.clearMyInfo();
      }
    });
  },
})
