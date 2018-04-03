// pages/main/main.js

var userDataManager = require('../../utils/UserDataManager.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    activeContent:'',
    activeTitle:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      list: userDataManager.GetTeamInfo().teams,
      activeContent: userDataManager.ActiveMiniContent(),
      activeTitle: userDataManager.ActiveTitle()
    })
  },
  gotoRule:function()
{
    wx.navigateTo({
      url: '../../pages/rule/rule'
    })
  }, onClickItem: function (e) {

    var item = e.currentTarget.dataset.item;

    if (item == null || item.teamIndex == "0") {
      wx.showModal({
        title: '提示',
        content: '数据异常',
        showCancel: false,
      })
    }
    else {
      console.log("goto group")

      wx.navigateTo({
        url: '../../pages/group/group',
      })
    }
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