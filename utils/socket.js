import { globalData } from '../app.js'
export let socketData = {
  socket: null,
  typeObj: {
    setType: '200201',
    controlType: '200202',
    successCode: '500200',
    failCode: '500101',
    resFailCode: '500112'
  }
}
export class DeviceWs {
  constructor(options = {}) {
    //重连延迟函数序列
    this.setTime = ""
    //是否连接成功
    this.isConnect = false
    //心跳延迟函数序列
    this.heartsTime = 0
    //是否关闭心跳代码
    this.colseHeart = false
    // 操作类型
    this.mtype = options.mtype
    //微信唯一标识
    this.unionid = options.unionid || globalData.wxUserInfo.unionid
    // 客户类型
    this.clienttype = options.clienttype || "1"
  }
  // ws用户认证连接
  connectWs(callback) {
    let that = this
    if (!socketData.socket) {
      socketData.socket = wx.connectSocket({
        url: globalData.wsUrl,
        success: (res) => {
          that.socketOpen(callback);
        },
        fail: (err) => {
          console.log('websocket连接失败' + JSON.stringify(err))
          that.failReset()
        }
      })
    }
  }
  // 打开ws
  socketOpen(callback) {
    let that = this
    //检测异常关闭则执行重连
    wx.onSocketError((err) => {
      console.log('websocket发生错误' + JSON.stringify(err))
      that.failReset();
    });
    wx.onSocketClose((err) => {
      console.log('websocket发生错误' + JSON.stringify(err))
      that.failReset();
    });
    // 打开ws发送消息
    wx.onSocketOpen(function (res) {
      let msg = {
        "unionid": globalData.unionid,
        "clienttype": that.clienttype
      }
      wx.sendSocketMessage({
        data: JSON.stringify(msg),
        success: (res) => {
          that.isConnect = true;
          that.heartConnect()
        },
        fail: (err) => {
          console.log('websocket发送消息失败' + JSON.stringify(err))
          that.failReset();
        }
      })
      that.resMsg(callback)
    })
  }
  // 心跳发送
  heartConnect() {
    let that = this
    clearTimeout(this.heartsTime);
    this.heartsTime = setTimeout(() => {
      let heartbeat = {
        "unionid": globalData.unionid,
        "clienttype": that.clienttype
      }
      wx.sendSocketMessage({
        data: JSON.stringify(heartbeat),
        success: (res) => {
          that.heartConnect();
        },
        fail: (err) => {
          console.log('websocket发送心跳失败' + JSON.stringify(err))
        }
      });
    }, 30 * 1000);
  }
  // 接受ws数据返回
  resMsg(callback) {
    wx.onSocketMessage(function (res) {
      let response = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      if (callback) {
        callback(response)
      }
    })
  }
  // 失败处理
  failReset() {
    if (!this.colseHeart) {
      this.isConnect = false
      this.resetWs()
    }
  }
  // ws重连
  resetWs() {
    //必须先清理之前的定时器
    let that = this;
    clearTimeout(this.setTime);
    //判断是否连接成功，成功则不再进行重新连接
    if (!this.isConnect) {
      //延迟发送
      this.setTime = setTimeout(() => {
        socketData.socket = null
        that.connectWs()
      }, 10 * 1000);
    }
  }
  //断开ws连接
  closeWs() {
    this.colseHeart = true
    clearTimeout(this.setTime)
    clearTimeout(this.heartsTime)
    socketData.socket = null
    wx.closeSocket()
  }
  run(callback) {
    let msg = {}
    // 查询设备列表
    if (this.mtype === typeObj.setType) {
      msg = {
        "mtype": this.mtype,
        "clienttype": this.clienttype
      }
    } else if (this.mtype === typeObj.controlType) {
      msg = {
        "mtype": this.mtype,
        "clienttype": this.clienttype
      }
    }
    wx.sendSocketMessage({
      data: JSON.stringify(msg),
      success: (res) => {
      },
      fail: (err) => {
        console.log('websocket发送消息失败' + JSON.stringify(err))
      }
    })

    wx.onSocketMessage(function (res) {
      res.data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      if (callback){
        callback(res.data)
      }
    })
  }
}