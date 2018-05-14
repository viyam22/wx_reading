var APP = getApp()
Page({
  data: {
    bookData: [],
    searchValue: ''
  },
  //事件处理函数
  onLoad: function(options) {
    var that = this;
    var data = JSON.parse(options.searchData);
    that.getData(data);
  },
  toDetail: function(event) {
    wx.navigateTo({
      url: '../bookDetail/bookDetail?data=' + JSON.stringify(event.target.dataset.bookdata)
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  search: function() {
    var data= {
         q: this.data.searchValue,
         tag: '',
         start: '',
         count: 10
      };
      this.getData(data);
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
        console.log(res.data)
      }
    })
  }
})
