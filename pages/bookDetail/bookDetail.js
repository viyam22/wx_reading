const APP = getApp();
const {Query, Object, ACL, User} = require('../../libs/av-weapp-min.js');
Page({
  data: {
    bookData: [],
    bookStatus: null,
    isReading: null,
    isCollection: null,
    review: null,
    reviewAlert: true,
    reviewTip: null
  },
  //事件处理函数
  onLoad: function ({data}) {
    let that = this,
        bookData = JSON.parse(data);
    that.getData(bookData);
  },
  getData: function(bookData) {
    let that = this;
    that.findStatus(bookData);
    that.setData({
      bookData: bookData
    });
    
  },
  findStatus: function(bookData) {
    let that = this;
    let userQuery = new Query('book_status');
    userQuery.equalTo('userId', APP.globalData.userId);

    let bookQuery = new Query('book_status');
    bookQuery.equalTo('bookId', bookData.id);

    var query = Query.and(userQuery, bookQuery);

    query.find().then(function(res) {
      that.setData({
        bookStatus: res[0],
        isReading: res[0].attributes.isReading,
        isCollection: res[0].attributes.isCollection
      });
      console.log('查询图书收藏是否有数据 in findStatus', that.data.bookStatus);
    });
  },
  bookStatus: function(event) {
    let that = this;
    console.log(that.data.bookStatus);
    //查询没有结果则创建一个对象
    if (!that.data.bookStatus) {
      
      // console.log(that.data.bookData);
      let UserObj = Object.extend('book_status');
      let userObj = new UserObj();

      userObj.set('userId', APP.globalData.userId);
      userObj.set(event.target.dataset.status, true);
      userObj.set('bookIsbn', that.data.bookData.isbn13);
      userObj.set('title', that.data.bookData.title);
      userObj.set('author', that.data.bookData.author);
      userObj.set('publisher', that.data.bookData.publisher);
      userObj.set('image', that.data.bookData.image);
      userObj.set('price', that.data.bookData.price);
      userObj.set('bookId', that.data.bookData.id);

      userObj.save().then(function (res) {
        that.setData({
          bookStatus: res,
          isReading: res.attributes.isReading,
          isCollection: res.attributes.isCollection
        });
      }, function (err) {
        console.error(err);
      });
    } else {
      //否则更新现有数据
      var statusUpdata = Object.createWithoutData('book_status', that.data.bookStatus.id);
      statusUpdata.set(event.target.dataset.status, true);
      statusUpdata.save().then(function (res) {
        that.setData({
          bookStatus: res,
          isReading: res.attributes.isReading,
          isCollection: res.attributes.isCollection
        });
      });
    }
  },
  bindKeyInput: function(e) {
    const that = this;
    that.setData({
      review: e.detail.value
    })
  },
  submit: function() {
    const that = this;
    if (!that.data.review) {
      that.setData({
        reviewAlert: false,
        reviewTip: '书评不能为空哦！'
      });
      setTimeout(function(){
        that.setData({reviewAlert: true});
      }, 1500);
      return;
    }
    var statusUpdata = Object.createWithoutData('book_status', that.data.bookStatus.id);
      statusUpdata.set('review', that.data.review);
      statusUpdata.save().then(function (res) {
        console.log(res);
        that.setData({
          // bookStatus: res,
          reviewTip: '评论成功！',
          reviewAlert: false,
        });
        setTimeout(function(){
          that.setData({reviewAlert: true});
        }, 1500);
      });
  }
})
