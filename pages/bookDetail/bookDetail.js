var app = getApp()
Page({
  data: {
  },
  //事件处理函数
  selectTag: function(event) {
    var index = event.target.dataset.index;
    for(let i = 0, len = this.data.tagData.length; i < len; i++) {
      this.data.tagData[i].selected = 'head-tag';
    }
    this.data.tagData[index].selected = 'selected';
    this.setData({
      tagData: this.data.tagData
    })
  }
})
