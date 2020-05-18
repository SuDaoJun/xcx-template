//app.js
const api = require('./utils/api')
App({
  globalData: {
    userInfo: null,
    wsUrl: "ws://192.168.1.107:9990",
    // 小程序开发信息
    wxUserInfo: {
      appId: 'wx63aa59c843227edc',
      appValue: '0823d5b8fe2e3d552698274081d9db62',
      unionid: ''
    },
    // 导航栏高度
    barObj: {
      statusBarHeight: 20,
      titleBarHeight: 48
    }
  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        this.globalData.barObj.statusBarHeight = res.statusBarHeight || 20
        this.globalData.barObj.titleBarHeight = res.model.indexOf('iPhone') !== -1 ? 44 : 48
        let version = res.SDKVersion
        version = version.replace(/\./g, "")
        if (parseInt(version) < 230) {// 小于230的版本 基础库
          wx.showModal({
            title: '提示',
            content: '该微信版本不支持部分组件，请更新微信！',
            showCancel: false,
            success(res) {

            }
          })
        }
      },
      fail(err) {
        console.log(err);
      }
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                lang: "zh_CN",
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                  this.globalData.wxUserInfo.unionid = 'unionid'
                  if (this.unionidReadyCallback) {
                    this.unionidReadyCallback('unionid')
                  }
                  // api.getWxInfo({
                  //   appid: this.globalData.wxUserInfo.appId,
                  //   secret: this.globalData.wxUserInfo.appValue,
                  //   js_code: code,
                  //   encryptedData: res.encryptedData,
                  //   iv: res.iv
                  // }).then((response) => {
                  //   if (response.code === '10000') {
                  //     this.globalData.wxUserInfo.unionid = response.data.unionid
                  //     if (this.unionidReadyCallback) {
                  //       this.unionidReadyCallback(response)
                  //     }
                  //   } else {
                  //     wx.showToast({
                  //       title: '微信唯一标识获取失败',
                  //       icon: 'none',
                  //       duration: 2000
                  //     })
                  //   }
                  // })
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
      }
    })
  }
})
export let globalData = getApp().globalData