var APP = getApp();
const {Query} = require('../../libs/av-weapp-min.js');

Page({
  data: {
    reviewList: [],
    reviewCount: '',
  },

  onLoad: function() {
    var that = this
    that.getData();
  },

  getData: function() {
    let that = this,
        reviewList = [];
    let reviewQuery = new Query('book_status');
    reviewQuery.equalTo('userId', APP.globalData.userId);

    reviewQuery.find().then(res => {
      console.log(res);
      res.forEach(item => {
        if (!!item.attributes.review === true){
          reviewList.push(item.attributes);
        }
      })
      that.setData({
        reviewList,
        reviewCount: reviewList.length,
      });
    })
  }
})
