import moment from 'moment'

/**
 * 获取对象tag
 * @param value
 * @returns {string}
 */
export const getTag = (value) => {
  return Object.prototype.toString.call(value)
}

/**
 * 获取对象类型
 * @param value
 * @returns {string}
 */
export const getType = (value) => {
  return getTag(value).slice(8, -1).toLowerCase()
}

/**
 * 是否为空
 * @param value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value == null) {
    return true
  }
  if (Array.isArray(value) || typeof value === 'string' || value instanceof String) {
    return value.length === 0
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }
  if (getTag(value) === '[object Object]') {
    return Object.keys(value).length === 0
  }
  return false
}

/**
 * 填充对象
 * @param target
 * @param source
 * @returns {{}}
 */
export function polyfill(target = {}, source = {}) {
  const mergeObj = { ...target, ...source }
  const newObj = {}
  Object.keys(mergeObj).forEach((key) => {
    if (getType(target[key]) === 'object') {
      if (!isEmpty(source[key])) {
        newObj[key] = polyfill(target[key], source[key])
      } else {
        newObj[key] = target[key]
      }
    } else {
      newObj[key] = isEmpty(source[key]) ? target[key] : source[key]
    }
  })
  return newObj
}

export const momentToString = (value, valueFormat = 'YYYY-MM-DD') => {
  if (Array.isArray(value)) {
    return value.map((val) => (moment.isMoment(val) ? val.format(valueFormat) : val))
  } else {
    return moment.isMoment(value) ? value.format(valueFormat) : value
  }
}

export const dateToMoment = (value, valueFormat = 'YYYY-MM-DD') => {
  if (Array.isArray(value)) {
    return value.map((val) => (moment.isMoment(val) ? val : moment(val, valueFormat)))
  } else {
    return moment.isMoment(value) ? value : moment(value, valueFormat)
  }
}
