var APP = getApp();
Page({
  data: {
    userInfo: null
  },
  onLoad: function(){
    var that = this
    that.setData({
      userInfo:APP.globalData.userInfo
    })
  }
})