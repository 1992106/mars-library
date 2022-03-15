import setting from '@/src/config/index'
import { message } from 'ant-design-vue'
import { getAccessToken } from '@/utils'
import store from '@/src/store'
import router from '@/src/router'

const fetchPost = (url, body) => {
  const aplUrl = setting.mock ? url : `${setting.api_url}${url}`
  const token = getAccessToken()
  return new Promise((resolve, reject) => {
    fetch(aplUrl, {
      method: 'POST',
      headers: {
        ...(token ? { [setting.authorization_name]: `${setting.token_prefix} ${token}` } : {})
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        // 当接收到一个代表错误的 HTTP 状态码时，从 fetch() 返回的 Promise 不会被标记为 reject， 即使响应的 HTTP 状态码是 404 或 500。
        // 相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false ），仅当网络故障时或请求被阻止时，才会标记为 reject
        if (response.ok) {
          return response.json()
        }
        // TODO: 在这里使用new Promise中reject(response)抛出异常只能被外层（调用myFetch的地方）捕获；
        // TODO: 为了在fetch的catch中统一处理错误，只能使用以下2种方法 throw 或者 return Promise.reject抛出异常
        throw new Error(response)
        // return Promise.reject(response)
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
        // TODO: 该catch只捕获fetch内部抛出的异常（即第一个then中 throw 或者 return Promise.reject）
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
}

export default fetchPost
