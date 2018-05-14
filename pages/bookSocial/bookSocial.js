var APP = getApp();
const {Query} = require('../../libs/av-weapp-min.js');
Page({
  data: {
    userInfo: null,
    searchValue: '',
    userInfo: [],
    followInfo: [],
    ranking: ' ',
  },

  onLoad: function() {
    var that = this
    that.getUserInfo();
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
  },

  getMyCount: function() {
    let that = this,
        userInfo = that.data.userInfo,
        myDate = new Date(),
        year = myDate.getFullYear(),
        month = myDate.getMonth() + 1;

    let calendarQuery = new Query('calendar');
    calendarQuery.equalTo('userId', APP.globalData.userId);
    calendarQuery.equalTo('year', year);
    calendarQuery.equalTo('month', month);
    calendarQuery.find().then(([res]) =>{
      res ? userInfo.count = res.attributes.day.length : userInfo.count = 0;
      that.setData({userInfo});
    });
  },
  
  getUserInfo: function() {
    let that = this,
        userInfo = [],
        myDate = new Date(),
        year = myDate.getFullYear(),
        month = myDate.getMonth() + 1,
        uaerQuery = new Query('user');
        
    uaerQuery.equalTo('objectId', APP.globalData.userId);
    uaerQuery.include('following');

    uaerQuery.find().then(([res]) => {
      res.attributes.following.push(APP.globalData.userId)
      userInfo = {
        id: res.id,
        followingId: res.attributes.following,
        imageUrl: res.attributes.imageUrl,
        nickName: res.attributes.nickName,
        following: [],
      }
      userInfo.followingId.map((followingId) => {
        let follewQuery = new Query('user');

        follewQuery.equalTo('objectId', followingId);
        follewQuery.find().then(([res]) => {
          let count,
              tempRes = res;
          let calendarQuery = new Query('calendar');
          calendarQuery.equalTo('userId', res.id);
          calendarQuery.equalTo('year', year);
          calendarQuery.equalTo('month', month);
          calendarQuery.find().then(([res]) =>{
            res ? count = res.attributes.day.length : count = 0;
            userInfo.following.push({
              id: tempRes.id,
              imageUrl: tempRes.attributes.imageUrl,
              nickName: tempRes.attributes.nickName,
              count,
            })
            that.orderBy(userInfo.following, 'count', 'desc');
          }).then(() => {
            that.setData({userInfo});
            for (let i = 0, len = userInfo.following.length; i < len; i++) {
              
              if (userInfo.following[i].id === APP.globalData.userId) that.setData({ranking: (i + 1)})
            }
            that.getMyCount();
          })
        })
      })
    })
  },

  //排序方法
  orderBy: function(value, propertyName, option) {
    let result;
    value.sort((prev, next) => {
      if(option === 'desc'){
        result = isNaN(next[propertyName] - prev[propertyName]) ? 
          new Date(next[propertyName]) - new Date(prev[propertyName]) : next[propertyName] - prev[propertyName];
      } else {
        result = isNaN(prev[propertyName] - next[propertyName]) ?
          new Date(prev[propertyName]) - new Date(next[propertyName]) : prev[propertyName] - next[propertyName];
      }
      return result;
    });
    return value;
  }

})