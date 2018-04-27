// pages/group/group.js
var userDataManager = require('../../utils/UserDataManager.js')
var timeUtil = require('../../utils/TimeUtil.js')

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["已打卡", "未打卡"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    groupInfo:"队伍信息",
    hasRecordList: [],  //已打卡列表
    noRecordList: [],   //未打卡列表
    list: []
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });


    var teamIndex = options.index;
    console.log("teamIndex", teamIndex)
    var team = userDataManager.GetGroupTodayInfo(teamIndex);

    if(team!=null)
    {
      //console.log("team", team)

      var hasRecordList = [];
      var noRecordList =[];

      for(var i=0; i<team.length;i++)
      {
          var item = team[i];
          if(item.distance>=3)
          {
            hasRecordList.push(item);
          }else{
            noRecordList.push(item);
          }
      }


      this.setData({
        list: team,
        hasRecordList: hasRecordList,
        noRecordList: noRecordList,
        groupInfo: teamIndex + "组 打卡信息"
      })

      wx.setNavigationBarTitle({
        title: "今日打卡-"+teamIndex+"组",
      })
    }
  },
  onClickItem: function (e) 
  {
    console.log("onClickItem:",e);
    
    //"../../pages/myInfo/myInfo?time={{item.time}}&timestamp={{item.timestamp}}&distance={{item.distance}}"
    /*
    wx.navigateTo({
      url: '../../pages/myInfo/myInfo'
    })
    */
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