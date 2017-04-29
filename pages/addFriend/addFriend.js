var APP = getApp();
const {Query, Object} = require('../../libs/av-weapp-min.js');
Page({
  data: {
    userInfo: null,
    userList: []
  },
  onLoad: function({searchUser}) {
    var that = this
    that.setData({
      userInfo:APP.globalData.userInfo
    })

    console.log('addFriend', searchUser);
    if(searchUser === "") return;
    that.searchUser(searchUser);
  },
  searchUser: function(nickName) {
    let that = this,
        userList = [],
        userQuery = new Query('user');

    userQuery.contains('nickName', nickName);
    userQuery.find().then((res) => {
      
      res.map((res) => {
        if(res.id !== APP.globalData.userId) {
          let list = {
            id: res.id,
            imageUrl: res.attributes.imageUrl,
            nickName: res.attributes.nickName
          }
          userList.push(list);
        }
      })
      that.setData({userList});
      console.log('bookSocial', that.data.userList);
    })
  },
  follow: function({target: {dataset: {id}}}) {
    let that = this;

    var followUser = Object.createWithoutData('user', APP.globalData.userId);
    followUser.add('following', id);
    followUser.save().then((res) => {
      console.log('addFriend---', res);
    })
  }
})