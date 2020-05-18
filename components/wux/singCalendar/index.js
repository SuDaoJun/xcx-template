// components/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentYear: { // 当前显示的年
      type: Number,
      value: new Date().getFullYear()
    },
    currentMonth: { // // 当前显示的月
      type: Number,
      value: new Date().getMonth() + 1
    },
    currentDate: { // // 当前显示的月
      type: Number,
      value: new Date().getDate()
    },
    showArr: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal, changedPath) {
        if (newVal !== oldVal) {
          let allArr = this.data.allArr;
          if (allArr.length > 0) {
            for (let i = 0; i < allArr.length; i++) {
              if (allArr[i].month === 'current' && newVal.indexOf(allArr[i].date) > -1) {
                allArr[i].checked = true;
              } else {
                allArr[i].checked = false;
              }
            }
            this.setData({
              allArr
            })

          }
        }
      }
    }
  },
  externalClasses: ['custom-calendar'],
  /**
   * 组件的初始数据
   */
  data: {
    initSend: true,
    currentMonthDateLen: 0, // 当月天数
    preMonthDateLen: 0, // 当月中，上月多余天数
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    allArr: [], // 当月所有数据
    timeObj: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    }
  },
  ready() {
    this.getAllArr()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取某年某月总共多少天
    getDateLen(year, month) {
      let actualMonth = month - 1;
      let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
      return timeDistance / (1000 * 60 * 60 * 24);
    },
    // 获取某月1号是周几
    getFirstDateWeek(year, month) {
      return new Date(year, month - 1, 1).getDay()
    },
    // 上月 年、月
    preMonth(year, month) {
      if (month == 1) {
        return {
          year: --year,
          month: 12
        }
      } else {
        return {
          year: year,
          month: --month
        }
      }
    },
    // 下月 年、月
    nextMonth(year, month) {
      if (month == 12) {
        return {
          year: ++year,
          month: 1
        }
      } else {
        return {
          year: year,
          month: ++month
        }
      }
    },
    // 获取当月数据，返回数组
    getCurrentArr() {
      let currentMonthDateLen = this.getDateLen(this.data.currentYear, this.data.currentMonth) // 获取当月天数
      let currentMonthDateArr = [] // 定义空数组
      if (currentMonthDateLen > 0) {
        for (let i = 1; i <= currentMonthDateLen; i++) {
          currentMonthDateArr.push({
            month: 'current', // 只是为了增加标识，区分上下月
            date: i
          })
        }
      }
      this.setData({
        currentMonthDateLen
      })
      return currentMonthDateArr
    },
    // 获取当月中，上月多余数据，返回数组
    getPreArr() {
      let preMonthDateLen = this.getFirstDateWeek(this.data.currentYear, this.data.currentMonth) // 当月1号是周几 == 上月残余天数）
      let preMonthDateArr = [] // 定义空数组
      if (preMonthDateLen > 0) {
        let { year, month } = this.preMonth(this.data.currentYear, this.data.currentMonth) // 获取上月 年、月
        let date = this.getDateLen(year, month) // 获取上月天数
        for (let i = 0; i < preMonthDateLen; i++) {
          preMonthDateArr.unshift({ // 尾部追加
            month: 'pre', // 只是为了增加标识，区分当、下月
            date: date
          })
          date--
        }
      }
      this.setData({
        preMonthDateLen
      })
      return preMonthDateArr
    },
    // 获取当月中，下月多余数据，返回数组
    getNextArr() {
      let totalNum = this.data.preMonthDateLen + this.data.currentMonthDateLen;
      let total = totalNum > 35?42:35
      let nextMonthDateLen = total - totalNum // 下月多余天数
      let nextMonthDateArr = [] // 定义空数组
      if (nextMonthDateLen > 0) {
        for (let i = 1; i <= nextMonthDateLen; i++) {
          nextMonthDateArr.push({
            month: 'next',// 只是为了增加标识，区分当、上月
            date: i
          })
        }
      }
      return nextMonthDateArr
    },
    // 整合当月所有数据
    getAllArr() {
      let preArr = this.getPreArr()
      let currentArr = this.getCurrentArr()
      let nextArr = this.getNextArr()
      let showArr = this.data.showArr;
      let allArr = [...preArr, ...currentArr, ...nextArr]
      for (let i = 0; i < allArr.length; i++){
        if (allArr[i].month === 'current' && showArr.indexOf(allArr[i].date) > -1){
          allArr[i].checked = true;
        }else{
          allArr[i].checked = false;
        }
      }
      this.setData({
        allArr
      })
      let sendObj = {
        currentYear: this.data.currentYear,
        currentMonth: this.data.currentMonth,
        allArr: allArr
      }
      if (!this.data.initSend){
        this.triggerEvent('sendObj', sendObj)
      }
      
    },
    selectDate(e){
      let item = e.currentTarget.dataset.item;
      let {currentYear, currentMonth} = this.data;
      if(item.month === 'current'){
        this.setData({
          currentDate: item.date,
          'timeObj.year': currentYear,
          'timeObj.month': currentMonth
        })
        let sendDate = {
          selectYear: currentYear,
          selectMonth: currentMonth,
          selectDate: item.date
        }
        this.triggerEvent('sendDate', {sendDate})
      }else{
        wx.showModal({
          title: '日期选择',
          showCancel: false,
          content: '请先切换到相应月份'
        })
      }
      
    },
    // 点击 上月
    gotoPreMonth() {
      wx.vibrateShort();
      let { year, month } = this.preMonth(this.data.currentYear, this.data.currentMonth)
      this.setData({
        currentYear: year,
        currentMonth: month,
        initSend: false
      })
      this.getAllArr()
    },
    // 点击 下月
    gotoNextMonth() {
      wx.vibrateShort();
      let { year, month } = this.nextMonth(this.data.currentYear, this.data.currentMonth)
      this.setData({
        currentYear: year,
        currentMonth: month,
        initSend: false
      })
      this.getAllArr()
    }
  }
})