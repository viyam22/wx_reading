const APP = getApp();
const {Query, Object} = require('../../libs/av-weapp-min.js');
Page({
  data: {
    tagData: [{
        name: "在读",
        selected: 'selected'
      },{
        name: "收藏",
        selected: 'head-tag '
      }],
    bookList: null,
    readBook: null,
    collectionBook: null,
    hidden: false,
    hasRefesh: false,
    read: true,
    collection: null
  },
  //事件处理函数
  selectTag: function(event) {
    var that = this;
    var index = event.target.dataset.index;
    console.log(event.target.dataset)
    for(let i = 0, len = that.data.tagData.length; i < len; i++) {
      that.data.tagData[i].selected = 'head-tag';
    }
    that.data.tagData[index].selected = 'selected';
    that.setData({
      tagData: that.data.tagData
    })
    if(index == 0){
      that.setData({
        read: true,
        collection: false
      })
    } else {
      that.setData({
        collection: true,
        read: false
      })
    }
  },
  toDetail: function(event) {
    let that = this;
    wx.request({
      url: APP.DB_URL + '/v2/book/isbn/' + event.target.dataset.isbn,
      header: {
          'content-type': 'application/json'
      },
      success: function({data}) {
        console.log('根据isbn获得图书信息', data);
        wx.navigateTo({
          url: '../bookDetail/bookDetail?data=' + JSON.stringify(data)
        })
      }
    })
  },
  getData: function() {
    const that = this;
    let query = new Query('book_status');
    query.equalTo('userId', APP.globalData.userId);
    query.descending('createdAt');

    query.find()
      .then((res) => {
        let readBook = [], collectionBook = [];
        let bookList = res.map((res) => {
          if(res.attributes.isReading === true) {
            readBook.push(res.attributes);
          } else if(res.attributes.isCollection === true) {
            collectionBook.push(res.attributes);
          }
          return res.attributes;
        });
        this.setData({
          readBook,
          collectionBook,
          bookList
        });
        if(that.data.hasRefesh) {
          that.setData({hasRefesh: false})
        }
      })
      .catch(console.error);

  },
  onLoad: function() {
    var that = this;
    that.getData();
  },
  refesh: function(e) {
    // wx.stopPullDownRefresh();
    console.log('刷新');
    const that = this;
    that.setData({hasRefesh: true});
    that.getData();
  }
})
