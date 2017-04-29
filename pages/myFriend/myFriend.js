var APP = getApp();
const {Query, Object} = require('../../libs/av-weapp-min.js');

Page({
  data: {
    userInfo: [],
    followingInfo: []
  },
  onLoad: function() {
    let that = this;

    that.getUserInfo();
  },
  getUserInfo: function() {
    console.log('------')
    let that = this,
        temp = [],
        query = new Query('user');

    query.equalTo('objectId', APP.globalData.userId);
    query.include('user');

    query.find().then(([res]) => {
      console.log('res', res);
      temp = res.attributes.following;
      let following = temp.map(temp => {
        console.log(temp);
        let following = temp.get('user');
        console.log('followingInfo', following);
        let followingInfo = following.get('nickName');
      })
    })
  },
  getFollowing:function() {
    console.log('------')
    let that = this,
        followingInfo = [],
        followingId = that.data.userInfo.following,
        query = new Query('user');

    followingId.map(followingId =>{
      query.equalTo('objectId', followingId);
      query.find().then(([res]) => {
        let userInfo = {
          id: res.id,
          imageUrl: res.attributes.imageUrl,
          nickName: res.attributes.nickName
        }
        followingInfo.push(userInfo)
        that.setData({followingInfo});
        console.log('jdif', followingInfo);
      })
    })
  }
})