//index.js
//获取应用实例
const app = getApp();
const wsUrl = app.globalData.wsUrl
import { DeviceWs } from '../../utils/socket.js'
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        lang: "zh_CN",
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    app.unionidReadyCallback = response => {
      app.globalData.wxUserInfo.unionid = response
      // this.getWebcoket()
    }
  },
  getWebcoket(){
    let socket = new DeviceWs()
    socket.connectWs(res=>{
      console.log(res)
    })
  },
  home(){
    wx.navigateTo({
      url: `../logs/logs`
    })
  }
})
