(factory => factory(window))(win => {
  if (!!win.createDatePicker) return

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
        el = el.offsetParent
      }
      return obj
    },
    assign() {    // 对象合并
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
    sup(num) {   // 数字不足两位数前面补零
      return num < 10 ? '0' + num : num
    },
    formatInfo(format) {   // 判断时间格式所包含的值
      let info = { format }
      if (/Y{4}/.test(format)) info.Y = true
      if (/M{2}/.test(format)) info.M = true
      if (/D{2}/.test(format)) info.D = true
      if (/h{2}/.test(format)) info.h = true
      if (/m{2}/.test(format)) info.m = true
      if (/s{2}/.test(format)) info.s = true
      return obj
    },
    dayCount(y, m) {    // 获取指定月份的天数
      if (m != 2) return dayArr[m - 1]
      if (y % 4 > 0) return 28
      return 29
    },
    joinDefDate(obj) {    // 拼接默认时间格式
      return obj.Y + '/' +
        obj.M + '/' +
        obj.D + ' ' +
        obj.h + ':' +
        obj.m + ':' +
        obj.s
    },
    joinDateObj(obj, format) {    // 拼接时间
      format = format || defConfig.format
      return format
        .replace(/Y{4}/, obj.Y)
        .replace(/M{2}/, _.sup(obj.M))
        .replace(/D{2}/, _.sup(obj.D))
        .replace(/h{2}/, _.sup(obj.h))
        .replace(/m{2}/, _.sup(obj.m))
        .replace(/s{2}/, _.sup(obj.s))
        .replace(/W{2}/, '周' + weekArr[new Date(_.joinDefDate(obj)).getDay()])
    },
    resetDate(str, format) {    // 根据时间格式获取自定义时间对象
      format = format || defConfig.format
      let obj = {}
      for (let i = 0; i < 6; i++) {
        let search = formatKey[i]
        let index = format.indexOf(search)
        if (index + 1 > 0) obj[dateKey[i]] = str.substr(index, search.length)
      }
      return obj
    },
    sortDate(a, b) {    // 时间对比
      let max, min
      let _a = new Date(a), _b = new Date(b)
      if (_a > _b) max = a, min = b
      else max = b, min = a
      return {max, min}
    },
    getRangeMs(obj, str, minus) {   // 计算时间范围相差的毫秒数
      let Y = obj.Y, M = obj.M
      let ms = 0
      let arr = str.match(/[YMDWhms]\d+/g) || []
      for (let i = 0; i < arr.length; i++) {
        let key = arr[i].substr(0, 1)
        let num = Number(arr[i].substr(1))
        switch (key) {
          case 'Y':
            for (let l = 0; l < num; l++) {
              if (minus) Y--
              if (Y % 4) ms += multiple.Y[0]
              else ms += multiple.Y[1]
              if (!minus) Y++
            }
          break
          case 'M':
            for (let l = 0; l < num; l++) {
              if (minus) {
                M--
                if (M < 1) Y--, M = 12
              }
              ms += multiple.M[_.dayCount(Y, M)]
              if (!minus) {
                M++
                if (M > 12) Y++, M = 1
              }
            }
          break
          default:
            ms += multiple[key] * num
        }
      }
      return ms
    },
    newDateObj(date) {    // 获取自定义时间对象
      date = date || new Date
      return {
        date,
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        W: date.getDay(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
      }
    }
  }

  const doc = win.document
  const body = doc.body
  const isFox = /.*Firefox.*/.test(navigator.userAgent)
  const dayArr = [31,[28,29],31,30,31,30,31,31,30,31,30,31]
  const weekArr = ['日','一','二','三','四','五','六']
  const monthArr = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
  const monthEnArr = ['Jan','Fed','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dateKey = ['Y','M','D','h','m','s']
  const formatKey = ['YYYY','MM','DD','hh','mm','ss']
  const multiple = {Y:[31536e6,316224e5],M:{'28':24192e5,'29':25056e5,'30':2592e6,'31':26784e5},W:6048e5,D:864e5,h:36e5,m:6e4,s:1e3}
  let defConfig = {
    format: 'YYYY/MM/DD'
  }

  let maxId = new Date().getTime()              // 输入框唯一标识

  function DatePicker (options) {
    this.config = _.assign(defConfig, options)
    this.create = _.newDateObj()                // 实例化时间
    this.init()
  }
  DatePicker.prototype = {
    init() {
      
    }
  }
  win.createDatePicker = options => new DatePicker(options)
  console.log("Author: Jhin\r\nGithub: https://github.com/Jhinsama/DatePicker")
})