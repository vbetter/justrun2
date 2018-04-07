// pages/group/group.js
var userDataManager = require('../../utils/UserDataManager.js')
var timeUtil = require('../../utils/TimeUtil.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo:"队伍信息",
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    timeUtil.Test()

    var teamIndex = userDataManager.m_curSelectGroup;
    console.log("teamIndex", teamIndex)
    var team = userDataManager.GetGroupTodayInfo(teamIndex);
    
    console.log("team",team)
    
    this.setData({
      list: team,
      groupInfo: teamIndex+"组 打卡信息"
    })

    var timestamp = Date.parse(new Date());
    var toDayMD = timeUtil.GetTodayMD();

    wx.setNavigationBarTitle({
      title: toDayMD+'打卡',
    })
  },
  onClickItem: function (e) {
    wx.navigateTo({
      url: '../../pages/record/record'
    })
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