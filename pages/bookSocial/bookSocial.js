var APP = getApp();
const {Query} = require('../../libs/av-weapp-min.js');
Page({
  data: {
    userInfo: null,
    searchValue: '',
  },
  onLoad: function() {
    var that = this
    that.setData({
      userInfo:APP.globalData.userInfo
    })
  },
  search: function() {
    var that = this;
    wx.navigateTo({
      url: '../addFriend/addFriend?searchUser=' + this.data.searchValue
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      searchValue: e.detail.value
    })
  }
})