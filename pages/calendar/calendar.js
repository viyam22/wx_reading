const APP = getApp();
const {Query, Object} = require('../../libs/av-weapp-min.js');
Page({
  data: {
    week: ['日', '一', '二', '三', '四', '五', '六'],
    date: [],
    calendar: [],
    count: 0,
    queryRecord: [],  //获取打卡的记录
    isRecord:false,  //是否进行打卡操作
    hasRecord:false  //是否已经打卡
  },

  onLoad: function() {
    let that = this,
        myDate = new Date(),
        date = {
          week: myDate.getDay(),
          year: myDate.getFullYear(),
          month: myDate.getMonth() + 1,
          day: myDate.getDate()
        };
    that.setData({date})
    that.queryRecord();
  },

  createRecord: function() {
    let that = this,
        year = that.data.date.year,
        month = that.data.date.month,
        day = that.data.date.day,
        calendar = that.data.calendar;
    if (that.data.isRecord === false) return;
    let RecordObj = Object.extend('calendar'),
        recordObj = new RecordObj();
    
    recordObj.set('userId', APP.globalData.userId);
    recordObj.set('year', 2017);
    recordObj.set('month', 3);
    recordObj.set('day',[day]);
    recordObj.save().then(res => {
      calendar.forEach(item => {
        if (item.date === day) {
          item.isRecord = true;
        }
      })
      
      that.setData({
        hasRecord: true,
        isRecord:false,
        calendar,
      })
    }, err => {
      console.error(err);
    });
  },

  updateRecord: function(id) {
    let that = this,
        day = that.data.date.day,
        calendar = that.data.calendar;
    if (that.data.isRecord === false) return;

    let recordObj = Object.createWithoutData('calendar', id);
    recordObj.add('day', day);
    recordObj.save().then(res => {
      calendar.forEach(item => {
        if (item.date === day) {
          item.isRecord = true;
        }
      })
      
      that.setData({
        hasRecord: true,
        isRecord:false,
        calendar,
      })
    }, err => {
      console.error(err);
    })
  },

  queryRecord: function() {
    let that = this,
        year = that.data.date.year,
        month = that.data.date.month; 

    let calendarObj = new Query('calendar');
    calendarObj.equalTo('userId', APP.globalData.userId);
    calendarObj.equalTo('year', year);
    calendarObj.equalTo('month', month);
    calendarObj.find().then(([res]) => {
      if (!res) {
        that.createRecord();
        that.createCalendar();
      } else {
        that.setData({queryRecord: res.attributes});
        that.data.isRecord === true ? that.setData({count: that.data.count + 1}) :
          that.setData({count: res.attributes.day.length})
        that.createCalendar();
        that.updateRecord(res.id);
      }
    }, err => {
      console.error(err);
    })
  },

  record: function() {
    let that = this;
    that.setData({isRecord:true})
    that.queryRecord();
  },

  createCalendar: function() {
    let that = this,
        firstDay = that.getFirstDay(),
        dayCount = that.getDayInMonth(),
        calendar = [],
        day = that.data.date.day,
        recordDay = that.data.queryRecord.day;
    
    recordDay && !!~recordDay.indexOf(day) ? that.setData({hasRecord: true}) : that.setData({hasRecord: false});
    for(let i = 0; i < firstDay; i++) {
      calendar.push({
        date: ' ',
        isRecord: false,
      })
    }
    for(let i = 0; i < dayCount; i++) {
      recordDay && !!~recordDay.indexOf(i + 1) ? (
        calendar.push({
        date: i + 1,
        isRecord: true,
      })
      ) : (
        calendar.push({
        date: i + 1,
        isRecord: false,
      })
      )
    }
    that.setData({calendar});
  },

  getDayInMonth: function() {
    let that = this,
        bigMonth = [1, 3, 5, 7, 8, 10, 12],
        miniMonth = [4, 6, 9, 11],
        month = that.data.date.month,
        year = that.data.date.year;

    if (!!~bigMonth.indexOf(month)){
      return 31;
    } else if (!!~miniMonth.indexOf(month)) {
      return 30;
    } else if (year % 100 === 0 && year % 400 !== 0) {
      return 28;
    } else if (year % 4 === 0) {
      return 29;
    } else {
      return 28;
    }
  },

  getFirstDay: function() {
    let that = this,
        day = that.data.date.day,
        week = that.data.date.week;

    return (7 - (day - week + 6) % 7) % 7;
  }
})