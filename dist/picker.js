(factory => {
  factory(window)
})(win => {
  const doc = win.document
  const isFox = /.*Firefox.*/.test(navigator.userAgent)
  const dayArr = [31,[28,29],31,30,31,30,31,31,30,31,30,31]
  const weekArr = ['日','一','二','三','四','五','六']
  const monthArr = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
  const monthEnArr = ['Jan','Fed','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  let defConfig = {
    format: 'YYYY-MM-DD'
  }

  const _ = {
    index(el) {   // 获取元素相对于兄弟元素的位置
      let index = -1
      let els = el.parentNode.children
      for (let i = 0; i < els.length; i++) {
        if (els[i] === el) {
          index = i
          break
        }
      }
      return index;
    },
    hasClass(el, name) {    // 判断元素时候拥有class
      if (!el.className) return false
      const regexp = new RegExp('(^|\\s+)' + name + '((?=\\s)|$)')
      return regexp.test(el.className)
    },
    adClass(el, name) {   // 为元素增加class
      if (!el.className) return el.className = name
      if (!_.hasClass(el, name)) el.className += ' ' + name
    },
    rmClass(el, name) {   // 删除元素中的class
      if (!el.className) return
      let regexp = new RegExp('(^|\\s+)' + name + '((?=\\s)|$)')
      el.className = el.className.replace(regexp, '')
    },
    toggleClass(el, name) {   // 元素中的class有则删，无则增
      if (_.hasClass(el, name)) return _.rmClass(el, name)
      _.adClass(el, name)
    },
    createEl(name) {  // 创建元素
      return doc.createElement(name)
    },
    css(el, name, state) {    // 设置css属性
      if (el.nodeType === 1) el.style[name] = state
      else
        for (let i = 0; i < el.length; i++) {
          el[i].style[name] = state
        }
    },
    className(el, name) {   // 设置className的值
      if (el.nodeType === 1) el.className = name
      else
        for (let i = 0; i < el.length; i++) {
          el[i].className = name
        }
    },
    listen(el, type, handle, rm) {    // 元素绑定事件
      if (rm) {
        el.removeEventListener(type, handle)
      } else {
        el.addEventListener(type, handle)
      }
    },
    getEl(el, name) {   // 获取元素
      return el.querySelectorAll(name)
    },
    closest(el, selector) {   // 获取符合条件的父元素
      if (selector.nodeType && selector.nodeType === 1)
        while (el) {
          if (el === selector) break
          el = el.parentNode
        }
      else
        switch (name[0]) {
          case '.':
            let regexp = new RegExp('(^|\\s+)' + selector.substring(1) + '(\\s+|$)')
            while (el) {
              if (regexp.test(el.className)) break
              el = el.parentNode
            }
          break
          case '#':
            while (el) {
              if ('#' + el.id === selector) break
              el = el.parentNode
            }
          break
          default:
            while (el) {
              if (el.nodeName.toLowerCase() === selector) break
              el = el.parentNode
            }
        }
      return el
    },
    trigger(el, type) {   // 事件触发
      if (doc.createEventObject){
        let e = d.createEventObject()
        el.fireEvent('on' + type,e)
      } else {
        let e = d.createEvent( 'HTMLEvents' )
        e.initEvent(type, true, true)
        el.dispatchEvent(e)
      }
    },
    stop(e) {   // 阻止事件冒泡
      if (e.stopPropagation) e.stopPropagation()
      else e.cancelBubble = true
    },
    offset(el) {    // 获取元素相对于文档的位置
      let obj = {
        top: 0,
        left: 0,
        width: el.offsetWidth,
        height: el.offsetHeight
      }
      while (el != null) {
        obj.top += el.offsetTop
        obj.left += el.offsetLeft
        el = el.parentNode
      }
      return obj
    },
    assign() {
      let arg = arguments
      let obj = {}
      for (let i = 0; i < arg.length; i++) {
        if (arg[i] instanceof Object && !(arg[i] instanceof Array))
          for (let key in arg[i]) {
            obj[key] = arg[i][key]
          }
      }
      return obj
    },
    isInput(el) {   // 判断元素是否为输入框
      if (el && el.nodeType === 1 && el.nodeName.toLowerCase() === 'input') return true
      return false
    },
    formatInfo(str) {   // 判断时间格式所包含的值
      let info = { str }
      if (/Y{4}(?!Y)/.test(str)) info.Y = true
      if (/M{2}(?!M)/.test(str)) info.M = true
      if (/D{2}(?!D)/.test(str)) info.D = true
      if (/h{2}(?!h)/.test(str)) info.h = true
      if (/m{2}(?!m)/.test(str)) info.m = true
      if (/s{2}(?!s)/.test(str)) info.s = true
      return obj
    },
    sup(num, count) {   // 数字不足指定位数前面补零
      let before = '0'
      if (count)
        while (count > 2) {
          before += '0'
          count--
        }
      return num > 9 ? num : before + num
    },
    dayCount(y, m) {
      if (m != 2) return dayArr[m - 1]
      if (y % 4 > 0) return 28
      return 29
    }
  }
  function DatePicker (options) {
    this.config = _.assign(defConfig, options)
    this.maxId = new Date().getTime() // 输入框唯一标识
    this.init()
  }
  DatePicker.prototype = {
    init() {
      
    }
  }
  win.DatePicker = DatePicker
})