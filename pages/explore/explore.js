//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
  },
  //事件处理函数
  more: function() {
    wx.navigateTo({
      url: '../more/more'
    })
  }
})
