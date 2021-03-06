//index.js
//获取应用实例
var APP = getApp()
Page({
  data: {
    userStatic:[{
            name: "我的好友",
            url: "../myFriend/myFriend",
            icon: "/static/quan.png"
        },{
            name: "打卡",
            url: "../calendar/calendar",
            icon: "/static/calendar.png"
        },{
            name: "我的书评",
            url: "../review/review",
            icon: "/static/comment.png"
        }],
    userInfo: {}
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  goTo: function(event) {
    let url = event.target.dataset.url
    if (!url) return;
    wx.navigateTo({url});
  },
  
  onLoad: function () {
    var that = this
    that.setData({
      userInfo:APP.globalData.userInfo
    })
  }
})
