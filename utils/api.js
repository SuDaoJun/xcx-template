export const API_BASE_URL = 'http://192.168.1.107:3000';
let token = wx.getStorageSync('token') || ''
export const request = (url, method, data, headerType ='application/x-www-form-urlencoded') => {
  let _url = '';
  if (url.indexOf('http') > -1){
    _url = url;
  }else{
    _url = API_BASE_URL + url;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': headerType,
        'Authorization': token
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(finish) {

      }
    })
  })
}

module.exports = {
  // 获取微信唯一凭证
  getWxInfo: data => request('/wx/getWXUserInfo', 'post', data),

}