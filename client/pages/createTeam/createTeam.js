// pages/createTeam/createTeam.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var userDataManager = require('../../utils/UserDataManager.js')
var timeUtil = require('../../utils/TimeUtil.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    team_count: 1, //我的分组号
    array: ['1', '2'],
    team_name: "",
    
    team_key: "",

    start_time_date:"",

    end_time_date: "",

    activeContent: ''
  },
  //点击创建跑团
  onClickCreate:function(e)
  {
    if (userDataManager.IsEnableRequestServer()== false)
    {
      util.showModel('请求失败', "微信登录失败，缺少openid")
      return;
    }

    var start_timestamp = timeUtil.GetTimestampByYMD(this.data.start_time_date);
    var end_timestamp = timeUtil.GetTimestampByYMD(this.data.end_time_date);

    console.log("start_timestamp:", start_timestamp)

    if (start_timestamp == null || start_timestamp == 0 ||end_timestamp == null || end_timestamp == 0 || start_timestamp >= end_timestamp)
    {
        util.showModel('请求失败', "检查时间设置")
        return;
    }

    if (util.isEmptyString(this.data.team_key))
    {
      util.showModel('请求失败', "请输入key")
      return;
    }

    if (util.isEmptyString(this.data.team_name)) {
      util.showModel('请求失败', "请输入跑团名")
      return;
    }

    if (util.isEmptyString(this.data.activeContent)) {
      util.showModel('请求失败', "请输入活动规则")
      return;
    }

    if (this.data.team_count==0 )
    {
      util.showModel('请求失败', "分组信息错误")
      return;
    }

    if (util.isEmptyString(userDataManager.m_myInfo.nickname))
    {
      util.showModel('请求失败', "昵称为空")
      return;
    }

    //创建一个跑团
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.createTeam,
      login: true,
      data: {
        team_key: that.data.team_key,
        open_id: userDataManager.m_myInfo.open_id,
        username: userDataManager.m_myInfo.nickname,
        start_time: start_timestamp,
        end_time: end_timestamp,
        activeContent: that.data.activeContent,
        team_name: that.data.team_name,
        team_count: that.data.team_count
      },
      success(result) {
        var msg = result.data != null && result.data.data != null && result.data.data.msg != null ? result.data.data.msg : "Error";
        if (result.data != null && result.data.data != null && msg == "success") {
          var group = result.data.data.group

          if (group != null || group != undefined) {
            console.log("创建跑团成功 ,group:", group)

            for (var i = 0; i < group.length; i++) {
              var item = group[i];
              group[i].teams = JSON.parse(item.teams);
              group[i].members = JSON.parse(item.members);
            }

            userDataManager.SetTeamInfo(group);

            userDataManager.SaveMyInfo();

            util.showSuccess('请求成功完成');

            wx.navigateBack({

            })

          } else {
            console.log("创建跑团失败 ,group:", group)
          }
        }
        else {
          util.showModel('创建跑团失败', msg);
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


    util.showSuccess('登录成功')
  },
  bindDateChange_start: function (e) {
    this.setData(
      {
        start_time_date: e.detail.value
      }
    )

  },
  bindDateChange_end: function (e) {
    this.setData(
      {
        end_time_date: e.detail.value
      }
    )
  },
  bindKeyInput_teamName: function (e) {
    this.setData({
      team_name: e.detail.value
    })
  },

  bindKeyInput_teamCount: function (e) {

    var tt = parseInt(e.detail.value)
    this.setData({
      team_count: tt
    })

    userDataManager.m_myInfo.team_count = tt
  },
  bindKeyInput_teamKey: function (e) {
    this.setData({
      team_key: e.detail.value
    })
  },
  bindKeyInput_activeContent: function (e) {
    this.setData({
      activeContent: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})