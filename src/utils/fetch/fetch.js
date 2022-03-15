import setting from '@/src/config/index'
import { message } from 'ant-design-vue'
import { getAccessToken } from '@/utils'
import store from '@/src/store'
import router from '@/src/router'

/**
 * 初始化请求头
 * @param method
 * @returns {Headers}
 */
const initHeaders = method => {
  const token = getAccessToken()
  return new Headers({
    ...(token ? { [setting.authorization_name]: `${setting.token_prefix} ${token}` } : {}),
    ...(method === 'POST' ? { 'Content-Type': 'application/json;charset=UTF-8' } : {})
  })
}

/**
 * 初始化请求
 * @param url
 * @param body
 * @param method
 * @returns {Request}
 */
const initRequest = (url, body, method) => {
  method = method.toUpperCase()
  const myInit = {
    method: method,
    headers: initHeaders(method),
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {})
    // credentials: 'include' // include: cookie既可以同域发送，也可以跨域发送。（后端Access-Control-Allow-Credentials设置为true时, Access-Control-Allow-Origin不能设置为*，需要设置动态的origin）
  }
  const aplUrl = setting.mock ? url : `${setting.api_url}${url}`
  return new Request(aplUrl, myInit)
}

/**
 * 请求方法
 * @param url
 * @param body
 * @param method
 * @param timeout 请求超时时间
 * @returns {Promise<unknown>}
 */
const myFetch = (url, body, method = 'POST', timeout = 3000) => {
  const myRequest = initRequest(url, body, method)
  const fetchPromise = new Promise((resolve, reject) => {
    fetch(myRequest)
      .then(response => {
        // 当接收到一个代表错误的 HTTP 状态码时，从 fetch() 返回的 Promise 不会被标记为 reject， 即使响应的 HTTP 状态码是 404 或 500。
        // 相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false ），仅当网络故障时或请求被阻止时，才会标记为 reject
        if (response.ok) {
          return response.json()
        }
        // TODO: 在这里使用new Promise中reject(response)抛出异常只能被外层（调用myFetch的地方）捕获；
        // TODO: 为了在fetch的catch中统一处理错误，只能使用以下2种方法 throw 或者 return Promise.reject抛出异常
        // throw new Error(response)
        // return Promise.reject(response)
        return Promise.reject(response)
      })
      .then((res = {}) => {
        // TODO: 本地mock返回的数据格式；真实情况下，需要根据后端返回的数据格式处理
        const { code, error } = res
        if (code === -1) {
          // TODO: 全局业务错误拦截
          message.error(error)
          reject(res)
        } else {
          resolve(res)
        }
      })
      .catch(err => {
        // promise对象里面同步代码抛出的错误在没有通过promise的catch方法捕获时是会打印报错的（不会阻止promise外面代码的执行），但是不会传递到外面触发其他错误监听函数（比如window.onerror、try-catch等）
        // TODO: 该catch只捕获fetch内部抛出的异常（即then中 throw 或者 return Promise.reject）
        // TODO: 全局请求错误拦截
        switch (err.status) {
          case 403:
            message.error(`登录已过期，重新登录！`)
            store.dispatch('user/logout')
            router.replace('/login')
            break
          case 404:
            message.error(`请求错误,未找到该资源！`)
            break
          default:
            message.error(`未知错误${err.status}！`)
            break
        }
        reject(err)
      })
  })
  // 实现请求超时
  const timeoutPromise = new Promise(function (resolve, reject) {
    setTimeout(() => {
      reject(new Error('fetch timeout'))
    }, timeout)
  })
  return Promise.race([timeoutPromise, fetchPromise])
}

export default myFetch
// https://www.cnblogs.com/wonyun/p/fetch_polyfill_timeout_jsonp_cookie_progress.html
