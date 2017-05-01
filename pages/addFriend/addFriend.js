var APP = getApp();
const {Query, Object} = require('../../libs/av-weapp-min.js');
Page({
  data: {
    searchUser: [],
    userInfo: null,
    searchUserName: '',
    isTip: false
  },

  onLoad: function({searchUser}) {
    let that = this;

    that.getUser();
    that.setData({searchUserName: searchUser})
  },

  getUser: function() {
    let that = this,
        userInfo = [],
        uaerQuery = new Query('user');

    uaerQuery.equalTo('objectId', APP.globalData.userId);
    uaerQuery.include('following');

    uaerQuery.find().then(([res]) => {
      userInfo = {
        id: res.id,
        followingId: res.attributes.following,
        imageUrl: res.attributes.imageUrl,
        nickName: res.attributes.nickName
      }
      that.setData({userInfo});
      that.searchUser();
    });
  },

  searchUser: function() {
    let that = this,
        searchUser = [],
        nickName = that.data.searchUserName,
        userQuery = new Query('user');
    
    that.setData({isTip: true});
    if(!nickName) return;

    userQuery.contains('nickName', nickName);
    userQuery.find().then((res) => {
      
      res.map(res => {
        if(res.id !== APP.globalData.userId && !~that.data.userInfo.followingId.indexOf(res.id)) {
          searchUser.push({
            id: res.id,
            isFollow: false,
            imageUrl: res.attributes.imageUrl,
            nickName: res.attributes.nickName,
          });
        }
      })
      that.setData({searchUser});
    })
  },

  follow: function({target: {dataset}}) {
    let that = this,
        searchUser = that.data.searchUser;

    let followUser = Object.createWithoutData('user', APP.globalData.userId);
    followUser.add('following', dataset.id);
    followUser.save().then((res) => {
      searchUser[dataset.index].isFollow = true;
      that.setData({searchUser});
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      searchUserName: e.detail.value
    })
  }
})