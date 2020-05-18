// components/navfooter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activePath: {
      type: String,
      value: 'home'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList: [
      {
        name: '首页',
        path: 'home',
        icon: 'iconSetting'
      },
      {
        name: '测试',
        path: 'baby',
        icon: 'iconData'
      },
      {
        name: '资讯',
        path: 'article',
        icon: 'iconNews'
      },
      {
        name: '我',
        path: 'personData',
        icon: 'iconProfile'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    pathSelect(e){
      let path = e.currentTarget.dataset.path
      this.setData({
        activePath: path
      })
    }
  }
})
