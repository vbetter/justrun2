//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var userDataManager = require('../../utils/UserDataManager.js')

Page({
    data: {
        enableCreate:false,//能否创建跑团
        activeKey:'',
        array: ['1', '2'],
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        isGroup: false, //是否分组createKey
        myGroupIndex:1 //我的分数号
    },
    onLoad: function () 
    {
      console.log("local teaminfo:",userDataManager.m_teamInfo)


    wx.setNavigationBarTitle({
      title: '个人设置',
    })
      this.setData({
        activeKey: userDataManager.GetActiveKey(),
        isGroup : userDataManager.IsGroup(),
        myGroupIndex: userDataManager.GetMyTeamIndex()
      });

      // 页面渲染后 执行
      console.log("onLoad:", userDataManager)
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
                if (result) {
                  userDataManager.SetUserInfo(result);

                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                          console.log('result.data.data:', result.data.data)
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                            userDataManager.SetUserInfo(result.data.data);
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
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        myGroupIndex: e.detail.value
      })
    },
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
    createKey:function(e)
    {
      //创建一个跑团
      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.createGroup,
        login: true,
        data: {
          group_key: this.data.activeKey,
          open_id: this.data.userInfo.openId,
        },
        success(result) {
          util.showSuccess('请求成功完成')
          var group = result.data.data.group

          console.log("group:",group)

          for (var i = 0; i < group.length; i++) {
            var item = group[i];
            group[i].teams = JSON.parse(item.teams);
            group[i].members = JSON.parse(item.members);
          }
          console.log(group)
          if (group!=null || group!= undefined)
          {
            userDataManager.SetTeamInfo(group);
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
    //上传用户数据
    doUploadUserData:function()
    {
      console.log("上传用户数据")

      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.uploadUserDataUrl,
        login: true,
        success(result) {
          util.showSuccess('请求成功完成')
          console.log('url:', config.service.uploadUserDataUrl)
          console.log('request success', result)
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
    doMyRecord:function(e)
    {
        wx.navigateTo({
          url: '../record/record',
        })
    },
  doDownloadUserData:function(e)
  {
    console.log(this.data.userInfo)

    console.log("更新数据:",this.data.activeKey)

    wx.request({

      url: config.service.getMyGroupInfo,
      data:{
        group_key: this.data.activeKey,
        open_id: this.data.userInfo.openId,
      },
      success: function (response) {
       

        if (response.data.data.msg == "success")
        {
          var group = response.data.data.group;
          console.log("group:", group)

          for (var i = 0; i < group.length;i++)
          {
             var item  = group[i];
             group[i].teams = JSON.parse(item.teams);
             group[i].members = JSON.parse(item.members);
          }
          console.log("group 2:", group)

          userDataManager.SetTeamInfo(group);
        }else{
          util.showModel('请求失败', response.data.data.msg);
        }
        
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
})
