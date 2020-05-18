import baseComponent from '../helpers/baseComponent'
import classNames from '../helpers/classNames'
const app = getApp();
baseComponent({
  properties: {
    prefixCls: {
      type: String,
      value: 'wux-navbar',
    },
    theme: {
      type: String,
      value: 'light',
    },
    title: {
      type: String,
      value: '',
    },
    leftText: {
      type: String,
      value: '',
    },
    backPage: {
      type: Boolean,
      value: true
    },
    rightText: {
      type: String,
      value: '',
    },
  },
  data: {
    barObj: app.globalData.barObj
  },
  ready(){

  },
  computed: {
    classes: ['prefixCls, theme', function (prefixCls, theme) {
      const wrap = classNames(prefixCls, {
        [`${prefixCls}--${theme}`]: theme,
      })
      const left = `${prefixCls}__left`
      const text = `${prefixCls}__text`
      const title = `${prefixCls}__title`
      const right = `${prefixCls}__right`

      return {
        wrap,
        left,
        text,
        title,
        right,
      }
    }],
  },
  methods: {
    onClick(e) {
      const { type } = e.currentTarget.dataset
      let backPage = this.data.backPage;
      if (backPage && type === 'left'){
        wx.navigateBack({
          delta: 1
        })
      }
      this.triggerEvent('click', { type })
    }
  }
})
