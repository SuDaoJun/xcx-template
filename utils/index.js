const moment = require('./moment')

// 数字补零
export const formatZero = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 获取当前时间格式化
export function currentDay(type = 'time') {
  if (type === 'time') {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  } else if (type === 'month') {
    return moment().format('YYYY-MM')
  } else if (type === 'day') {
    return moment().format('YYYY-MM-DD')
  }
}
// 传入时间格式化
export function timeTransform(time, type = 'time') {
  if (type === 'time') {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  } else if (type === 'month') {
    return moment(time).format('YYYY-MM')
  } else if (type === 'day') {
    return moment(time).format('YYYY-MM-DD')
  } else if (type === 'hour') {
    return moment(time).format('HH:mm:ss')
  }
}
// 判断深层次对象属性是否存在
export let objProp = (data, path) => {
  if (!data || !path) {
    return null
  }
  let tempArr = path.split('.');
  for (let i = 0; i < tempArr.length; i++) {
    let key = tempArr[i]
    if (data[key]) {
      data = data[key]
    } else {
      return null
    }
  }
  return data
}
// 手机号码验证
export const phoneRule = (value) => {
  return /^1[3456789]\d{9}$/.test(value)
}
// 邮箱验证
export const mailRule = (value) => {
  return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i.test(value)
}