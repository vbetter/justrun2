// pages/rule/rule.js
var userDataManager = require('../../utils/UserDataManager.js')
var util = require('../../utils/util.js')
var config = require('../../config')
var timeUtil = require('../../utils/TimeUtil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: 
  {
    isEditorMode:false,
    team_name: "x",
    team_lead: "x",
    team_key: "x",
    create_time: "x",
    start_time: "x",
    end_time: "x",
    activeContent: 'x',
    activeTitle: 'x'
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
    var teamInfo = userDataManager.GetTeamInfo();
    if (teamInfo!=null)
    {
      var teamLeadInfo = userDataManager.GetTeamLeadInfo();

      var _team_name = "x";
      var _team_leadName = teamLeadInfo.username;

      this.setData({
        isEditorMode: false,
        team_name: userDataManager.GetTeamInfo().team_name,
        team_lead: _team_leadName,
        team_key: teamInfo.team_key,
        create_time: timeUtil.GetMD(teamInfo.create_time*1000),
        start_time: timeUtil.GetMD(teamInfo.start_time * 1000),
        end_time: timeUtil.GetMD(teamInfo.end_time * 1000),

        activeContent: userDataManager.GetTeamInfo().activeContent
      })
    }
  },
  bindKeyInput_teamName: function (e) {
    this.setData({
      team_name: e.detail.value
    })
  },
  bindKeyInput_activeContent: function (e) {
    this.setData({
      activeContent: e.detail.value
    })
  },
  bindDateChange_start: function (e) {
    this.setData(
      {
        start_time_date: e.detail.value
      }
    )

  },
  bindDateChange_end: function (e) 
  {

    this.setData(
      {
        end_time_date: e.detail.value
      }
    )
  },
  onClickEditor:function(e)
  {
    this.setData({
      isEditorMode: true
    })
  },
  onClickEditorDone:function(e)
  {

    if (userDataManager.m_myInfo ==null)
    {
      util.showModel('请求失败', "数据异常，m_myInfo is null")
      return;
    }

    var start_timestamp = timeUtil.GetTimestampByYMD(this.data.start_time);
    var end_timestamp = timeUtil.GetTimestampByYMD(this.data.end_time);
    var team_key = userDataManager.m_myInfo.team_key;
    var open_id = userDataManager.m_myInfo.open_id;
    var team_name = this.data.team_name;

    console.log("team_name:", team_name)

    if (start_timestamp == null || start_timestamp == 0 || end_timestamp == null || end_timestamp == 0 || start_timestamp >= end_timestamp) {
      util.showModel('请求失败', "检查时间设置")
      return;
    }

    if (util.isEmptyString(team_key)) {
      util.showModel('请求失败', "请输入key")
      return;
    }

    if (util.isEmptyString(team_name)) {
      util.showModel('请求失败', "请输入跑团名")
      return;
    }

    if (util.isEmptyString(this.data.activeContent)) {
      util.showModel('请求失败', "请输入活动规则")
      return;
    }


    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.reviseTeam,
      login: true,
      data: {
        team_key: team_key,
        open_id: open_id,
        team_name: team_name,
        start_time: start_timestamp,
        end_time: end_timestamp,
        activeContent: that.data.activeContent
      },
      success(result) {
        if (result.data != null && result.data.data != null && result.data.data.msg == "success") {

          var group = result.data.data.group

          if (group != null || group != undefined) {
            console.log("修改用户数据成功 ,group:", group)

            for (var i = 0; i < group.length; i++) {
              var item = group[i];
              group[i].teams = JSON.parse(item.teams);
              group[i].members = JSON.parse(item.members);
            }

            userDataManager.SetTeamInfo(group);

            that.setData({
              startTimeStamp: userDataManager.m_teamInfo[0].start_time,
              endTimeStamp: userDataManager.m_teamInfo[0].end_time,
              hasTeam: true
            })

            util.showSuccess('请求成功完成');

            that.setData({
              isEditorMode: false
            })
          }
        }
        else {
          util.showModel('请求失败', result.data.data.msg);

          this.setData({
            isEditorMode: false
          })
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);

        this.setData({
          isEditorMode: false
        })
      }
    }
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      wx.request(options)
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