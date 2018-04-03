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
        isGroup:false, //是否分组
        myGroupIndex:1 //我的分数号
    },
    onLoad: function () {
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
    createKey:function(e)
    {
      //创建一个跑团

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
  doDownloadUserData:function(e)
  {
    console.log("更新数据")

    qcloud.request({

      data: { body: "ddd"},
      url: config.service.downloadUserDataUrl,
      success: function (response) {
        console.log(response);
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
})
