/**
 * 将时间转换为指定格式的字符串
 * @param {(Object|string|number)} time - 需要转换的时间，可以是 Date 对象、时间戳字符串或时间戳数字
 * @param {string} cFormat - 指定的时间格式字符串，默认为'{y}-{m}-{d} {h}:{i}:{s}'
 * @returns {string|null} - 返回转换后的字符串，如果输入无效则返回 null
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // ! getDay（）在周日返回 0
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 格式化时间
 * @param {number} time - 时间戳
 * @param {string} option - 时间格式选项
 * @returns {string} - 格式化后的时间字符串
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分')
  }
}

/**
 * 将 URL 中的参数字符串转换为对象
 * @param {string} url - 包含参数的 URL 字符串
 * @returns {Object} - 包含参数名和参数值的对象
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * 将列表数据转换为树状数据结构
 * @param {Array} list - 列表数据
 * @param {number|string} rootValue - 根节点的值
 * @returns {Array} - 转换后的树状数据
 */
export function transListToTreeData(list, rootValue) {
  const arr = []
  list.forEach(item => {
    if (item.pid === rootValue) {
      // 找到了匹配的节点
      arr.push(item)
      // 当前节点的 id 和 当前节点的子节点的 pid 是想等的
      const children = transListToTreeData(list, item.id) // 找到的节点的子节点
      if (children.length) {
        item.children = children
      } // 将子节点赋值给当前节点
    }
  })
  return arr
}
