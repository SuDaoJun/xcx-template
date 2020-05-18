//logs.js
import { timeTransform } from '../../utils/index.js'

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return timeTransform(log)
      })
    })
  }
})
