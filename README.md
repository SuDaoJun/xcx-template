## 前言

此 xcx-template 模板项目是微信小程序模板，使用组件wux-weapp


## 主要项目结构

```
- components
  - ec-canvas canvas 图表
  - navFooter 底部导航
  - wux wux组件
- utils
  - api   api接口封装
  - font  字体图标使用
  - index 常用方法封装，如时间格式化等
  - moment  moment源代码
  - socket  websocket封装（包括连接断开，发送和接收消息以及错误重连）
- app.js 全局数据以及unionid 唯一标识获取
```

## Build Setup ( 建立安装 )

通过微信开发者工具导入，修改project.config.json中的appid