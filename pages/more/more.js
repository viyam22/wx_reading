//index.js
//获取应用实例
var APP = getApp()
Page({
  data: {
    bookData: [],
    typeName: ''
  },
  //事件处理函数
  onLoad: function (options) {
    var that = this;
    that.setData({
      typeName: options.type
    })
    var data= {
         q: '',
         tag: options.type,
         start: '',
         count: 21
      };
    that.getData(data);
  },
  getData: function(data) {
    var that = this;
    wx.request({
      url: APP.DB_URL + '/v2/book/search',
      data: data,
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          bookData: res.data.books
        });
      }
    })
  },
  toDetail: function(event) {
    wx.navigateTo({
      url: '../bookDetail/bookDetail?data=' + JSON.stringify(event.target.dataset.bookdata)
    })
  }
})
