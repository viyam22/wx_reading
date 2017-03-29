//index.js
//获取应用实例
var APP = getApp()
Page({
  data: {
    userStatic:[
        {
            name: "阅读圈",
            url: "",
            icon: "/static/quan.png"
        },{
            name: "打卡",
            url: "",
            icon: "/static/calendar.png"
        },{
            name: "我的书评",
            url: "",
            icon: "/static/comment.png"
        },{
            name: "收藏",
            url: "",
            icon: "/static/remark.png"
        }
    ],
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    APP.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      console.log(userInfo);
    })
  }
})
