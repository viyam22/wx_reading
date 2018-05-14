var APP = getApp();
const {Query, Object} = require('../../libs/av-weapp-min.js');

Page({
  data: {
    userInfo: []
  },

  onLoad: function() {
    let that = this;

    that.getUserInfo();
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
          }).then(() => {
            that.setData({userInfo});
          })
        })
      })
    })
  },
  
  notFollow: function({target: {dataset}}) {
    let that = this,
        userInfo = [],
        followUser = Object.createWithoutData('user', APP.globalData.userId);
    followUser.remove('following', dataset.followingid);
    followUser.save().then((res) => {
      userInfo = that.data.userInfo;
      [userInfo.following[dataset.index], userInfo.following[userInfo.following.length - 1]] = 
        [userInfo.following[userInfo.following.length - 1], userInfo.following[dataset.index]];
      userInfo.following.pop();
      that.setData({userInfo});
    })
  }
})