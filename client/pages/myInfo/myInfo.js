// pages/myInfo/myInfo.js


var userDataManager = require('../../utils/UserDataManager.js')
var util = require('../../utils/util.js')
var config = require('../../config')
var timeUtil = require('../../utils/TimeUtil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    distance:"",
    isShowEnterBtn:true,
    date: "2018-04-01"
  },
  bindKeyInput: function (e) {
    this.setData({
      distance: e.detail.value
    })
  },

  onClickUpload:function(e)
  {

    var distanceFloat =0;
    var tValue = this.data.date
    var tpunchTimestamp = timeUtil.GetTimestampByYMD(tValue);

    console.log("tValue:", tValue)
    console.log("tpunchTimestamp:", tpunchTimestamp)

    if (this.data.distance != null)
    {
      distanceFloat = parseFloat(this.data.distance)
    }

    if (distanceFloat >= 3) 
    {

      util.showBusy('请求中...')
      var that = this
      var options = {
        url: config.service.punch,
        login: true,
        data: {
          group_key: userDataManager.m_myInfo.ActiveKey,
          open_id: userDataManager.m_myInfo.open_id,
          punch_timestamp: tpunchTimestamp,
          distance: distanceFloat
        },
        success(result) {

          if (result != null && result.data != null && result.data.data != null && result.data.data.msg == "success") {
            var group = result.data.data.group;
            console.log("更新本地数据:", group)

            if (group != null) {
              for (var i = 0; i < group.length; i++) {
                var item = group[i];
                group[i].teams = JSON.parse(item.teams);
                group[i].members = JSON.parse(item.members);
              }
              //需要刷新本地数据
              userDataManager.SetTeamInfo(group);

              that.setData({
                isShowEnterBtn: false
              })

              util.showSuccess('请求成功完成')
              console.log('request success', group)
            } else {
              util.showModel('请求失败', "result.data.data.group is null");
            }


          } else {
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

    } else {
      wx.showToast({
        icon:'none',
        title: '跑步距离必须大于3公里',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
    console.log("options:", options)
      
      this.setData({
        distance: options.distance.toString(),
        date: options.time.toString()
      })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
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
    this.setData({
      isShowEnterBtn: true
    })
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