//index.js
//获取应用实例
var APP = getApp()
Page({
  data: {
    searchValue: '',
    bookTypeData: [{
      type: '科幻',
      bookData: ''
    },{
      type: '计算机',
      bookData: ''
    },{
      type: '美术',
      bookData: ''
    },{
      type: '文学',
      bookData: ''
    }]
  },
  //事件处理函数
  onLoad: function() {
    var that = this;
    for(let i = 0, len = that.data.bookTypeData.length; i < len; i++){
      wx.request({
        url: APP.DB_URL + '/v2/book/search',
        data: {
          q: '',
           tag: that.data.bookTypeData[i].type,
           start: '',
           count: 7
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          that.data.bookTypeData[i].bookData = res.data.books;
          that.setData({
            bookTypeData: that.data.bookTypeData
          });
        }
      })
    }
  },
  toMore: function(event) {
    wx.navigateTo({
      url: '../more/more?type=' + event.target.dataset.type
    })
  },
  toDetail: function(event) {
    wx.navigateTo({
      url: '../bookDetail/bookDetail?data=' + JSON.stringify(event.target.dataset.bookdata)
    })
  },
  search: function() {
    var data= {
         q: this.data.searchValue,
         tag: '',
         start: '',
         count: 10
      };
    wx.navigateTo({
      url: '../searchResult/searchResult?searchData=' + JSON.stringify(data)
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      searchValue: e.detail.value
    })
  }
})
