//app.js
const AV = require('./libs/av-weapp-min.js');
// const Realtime = require('./libs/realtime.weapp.min.js').Realtime;

AV.init({
 appId: 'kXxRMU6lIJhjWkqXcjX075l3-gzGzoHsz',
 appKey: 'kghjV6SeUlcLjVc9qcy12AaE',
});
// const realtime = new Realtime({
//  appId: 'kXxRMU6lIJhjWkqXcjX075l3-gzGzoHsz',
//  noBinary: true,
// });

App({
  DB_URL: 'https://api.douban.com',
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    let that = this;
    let logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    that.getUserInfo();
  },
  getUserInfo: function(cb) {
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              that.signUser();
              typeof cb == "function" && cb(that.globalData.userInfo);
            }
          })
        }
      })
    }
  },
  signUser: function() {
    let that = this;
    let userQuery = new AV.Query('user');
    userQuery.equalTo('nickName', that.globalData.userInfo.nickName);
    userQuery.find().then(function(res) {
      if (res.length != 0) {
        that.globalData.userId = res[0].id;
        return;
      }
      let UserObj = AV.Object.extend('user'),
          userObj = new UserObj();

      userObj.set('nickName', that.globalData.userInfo.nickName);
      userObj.set('imageUrl', that.globalData.userInfo.avatarUrl);
      userObj.save().then(function ({id}) {
        that.globalData.userId = id;
      }, function (err) {
        console.error(err);
      });
    },function (err) {
      
    })
  },
  globalData:{
    userInfo: null,
    userId: null,
  }
})