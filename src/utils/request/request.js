/**
 * @class XRequest
 * @constructor
 * @param {Object} options
 *  @param {Number} options.request_timeout 超时时间
 *  @param {String} options.authorization_name token名字{headers: { Authorization: xxxx }}
 *  @param {String} options.base_url 请求公用前缀('http://www.baidu.com/api')
 *  @param {Function | null} options.onError 错误处理
 *  @param {Function | String | null} options.getToken 获取token的方法，也可以传入token字符串（如果是token字符串，则只在初始化时获取一次，不推荐）
 */
export default class XRequest {
  constructor(options) {
    this.options = options
  }

  // 判断类型是否为function
  static _isFunction(val) {
    const type = Object.prototype.toString.call(val)
    return type === '[object Function]' || type === '[object AsyncFunction]'
  }

  // 判断类型是否为字符串string
  static _isString(val) {
    return Object.prototype.toString.call(val) === '[object String]'
  }

  // 判断token来源并获取token
  _generateToken() {
    const { getToken } = this.options
    if (XRequest._isFunction(getToken)) {
      return getToken()
    }
    if (XRequest._isString(getToken)) {
      return getToken
    }
    return null
  }

  // 格式化参数并添加到url上 (http://www.xxx.com?a=1&b=2)
  _setObjToUrlParams(params) {
    if (params && Object.keys(params).length) {
      let queryString = ''
      Object.keys(params).forEach((key) => {
        queryString += `${key}=${encodeURIComponent(params[key])}&`
      })

      return `?${queryString.replace(/&$/, '')}`
    }

    return ''
  }

  // 为POST, PUT设置Accept & contentType
  _addContentType(isFormData) {
    return {
      'Content-Type': isFormData ? 'application/x-www-form-urlencoded' : 'application/json; charset=utf-8'
    }
  }

  // 生成请求body数据
  _generateBodyData(method, isFormData, options = {}) {
    let body = null

    if (method === 'GET' && isFormData) {
      throw new Error('FormData必须使用POST')
    }
    if (!isFormData) {
      if (method === 'POST') {
        body = JSON.stringify(options.body || options)
      }
    } else {
      body = new FormData()
      Object.keys(options).forEach((key) => {
        const value = options[key]
        if (Array.isArray(value)) {
          value.forEach((val) => {
            body.append(key, val)
          })
        } else {
          body.append(key, value)
        }
      })
    }

    return body
  }

  // 生成请求url参数
  _generateQuery(url, method, options = {}) {
    const { base_url } = this.options
    const params = method === 'GET' ? options : options?.params
    const query = params ? this._setObjToUrlParams(params) : ''

    // 如果以(http || https)开头则不需要拼接baseUrl
    if (url.startsWith('http')) {
      return url + query
    }
    return base_url + url + query
  }

  // 检查请求返回状态
  _checkStatus(response) {
    if (response.status >= 200 && response.status <= 400) {
      return response.json()
    }

    // 未登录或token失效
    if (response.status === 401 || response.status === 403) {
      return Promise.reject({
        content: null,
        msg: '未登录或授权已过期，请重新登录！',
        status: response.status
      })
    }

    // 其它错误
    return Promise.reject({ content: null, msg: '系统错误！', status: -10010 })
  }

  // 检查请求错误
  _checkError(result, resolve) {
    if (result?.status !== 200) {
      return Promise.reject(result)
    }

    return resolve(result)
  }

  // 请求错误处理
  _handleError(err, reject) {
    // const { reLogin } = this.options

    if (!err?.status) {
      //   if ([401, 403].includes(err.status)) {
      //     if (XRequest._isFunction(reLogin)) {
      //       reLogin()
      //     }
      //   }
      // } else {
      err = { content: null, msg: '网络请求失败，请重试！', status: -10086 }
    }

    return reject(err)
  }

  /**
   * @description 公用请求方法
   * @param {String} url 请求路径
   * @param {Object} options 请求参数
   * @param {Object} config 配置参数
   *   @param {Object}  config.headers 请求头参数
   *   @param {Boolean} config.isFormData 是否表单提交
   *   @param {Boolean} config.autoTips 是否自动提示(暂时弃用)
   * @returns Promise
   */
  async request(url, options, config) {
    const { onError, authorization_name } = this.options
    const { method, headers, isFormData } = config || {}
    const token = this._generateToken()

    url = this._generateQuery(url, method, options)
    const myOptions = {
      method,
      headers: {
        ...headers,
        ...this._addContentType(isFormData),
        ...(token ? { [authorization_name]: token } : {})
      },
      body: this._generateBodyData(method, isFormData, options)
    }

    const Request = new Promise((resolve, reject) => {
      return fetch(url, myOptions)
        .then((res) => this._checkStatus(res))
        .then((res) => this._checkError(res, resolve))
        .catch((err) => this._handleError(err, reject))
    })

    const Timer = new Promise((resolve, reject) =>
      setTimeout(
        () => reject({ msg: '网络请求超时，请重试！', timeout: true, error: true, status: 408 }),
        this.options.request_timeout * 1000
      )
    )

    // request timeout
    return Promise.race([Request, Timer]).catch((error) => {
      error = { ...error, error: true }
      if (XRequest._isFunction(onError)) {
        onError(error)
      }
      return error
    })
  }

  get(url, options = {}, config = {}) {
    return this.request(url, options, { ...config, method: 'GET' })
  }

  post(url, options = {}, config = {}) {
    return this.request(url, options, { ...config, method: 'POST' })
  }
}
