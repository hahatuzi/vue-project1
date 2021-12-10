
// exclude里面的值不进行深度克隆
export function deepClone (source, exclude = []) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !exclude.includes(key)) {
      targetObj[key] = deepClone(source[key], exclude)
    } else {
      targetObj[key] = source[key]
    }
  })
  return targetObj
}

/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param t
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn, t = 500) => {
  let timer
  return function () {
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, t)
  }
}

/**
 * 函数节流（规定时间内只一次生效）
 * @param fn
 * @param t
 * @returns {Function}
 * @constructor
 */
export const Throttle = (fn, t = 500) => {
  let timer
  let prev = 0

  return function () {
    const now = Date.now()
    const remaining = t - (now - prev)
    const args = arguments
    if (remaining <= 0 || remaining > t) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      prev = now
      fn.apply(this, args)
    } else if (!timer) {
      timer = setTimeout(() => {
        prev = Date.now()
        timer = null
        fn.apply(this, args)
      }, remaining)
    }
  }
}

/**
 * 动态加载js
 * @param {*} url
 * @param {*} callback
 */
export const loadJS = (url, callback) => {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.callback = typeof callback !== 'undefined' ? callback : function () { }
  script[document.all ? 'onreadystatechange' : 'onload'] = function () {
    if (
      document.all &&
      this.readyState !== 'loaded' &&
      this.readyState !== 'complete'
    ) {
      return
    }
    this.callback(this)
    this.callback = null
    this[document.all ? 'onreadystatechange' : 'onload'] = null
    this.parentNode.removeChild(this)
  }
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}


/**
 * 获取年月日
 */
export const formatDate = (date) => {
  const year = date.getFullYear() // 得到年份
  let month = date.getMonth() // 得到月份
  let day = date.getDate() // 得到日期
  month = month + 1
  month = month.toString().padStart(2, '0')
  day = day.toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}


/**
 * 定时任务
 * @param {sting} time 定时：'10:00:00'
 * @param {function} fn 任务
 */
export const executeFnAt = (time, fn) => {
  const nowDate = new Date()
  const targetArr = time.split(':')
  const nowSeconds = nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + +nowDate.getSeconds()
  const targetSeconds = targetArr[0] * 3600 + targetArr[1] * 60 + +targetArr[2]
  const timeInterval = targetSeconds > nowSeconds ? targetSeconds - nowSeconds : targetSeconds - nowSeconds + 24 * 3600
  setTimeout(fn, timeInterval * 1000)
}

/**
 * 进入全屏
 */
export const setFullscreen = (ele) => {
  const el = ele || document.documentElement
  const rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen
  if (!rfs) return true
  rfs.call(el)
}

/**
 * 退出全屏
 */
export const exitFullscreen = () => {
  const el = parent.document
  const cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen
  if (!cfs) return true
  cfs.call(el)
}

/**
 * 获取n天之前/后 的日期 =>['2021-11-10','2021-11-17']
 * @param {number} days 7天前：-7
 * @param {number | string} currentDate 起始时间，默认当前日期
 */
export const getDaysBefore = (days, currentDate) => {
  const currentDateTime = currentDate ? new Date(currentDate) : new Date()
  const tempDate = new Date(currentDateTime)
  const resultDate = tempDate.setDate(tempDate.getDate() + days)
  const current = currentDateTime.toLocaleDateString().replace(/\//g, '-')
  const other = new Date(resultDate).toLocaleDateString().replace(/\//g, '-')
  const beforeDate = days > 0 ? current : other
  const afterDate = days > 0 ? other : current
  return [beforeDate, afterDate]
}
