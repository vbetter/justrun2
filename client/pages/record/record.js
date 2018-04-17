
var userDataManager = require('../../utils/UserDataManager.js')
var util = require('../../utils/util.js')
var config = require('../../config')
var timeUtil = require('../../utils/TimeUtil.js')

// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_date:"",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myRecord = userDataManager.GetMyAllRecords();
    console.log(myRecord)
    this.setData({
    
      list : myRecord == null ? [] : myRecord
    })
  },
  onClickItem: function (e) {

    var item = e.currentTarget.dataset.item;
    console.log(item)

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