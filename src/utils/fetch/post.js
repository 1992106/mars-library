import setting from '@src/config/index'
import { message } from 'ant-design-vue'
import { getAccessToken } from '@utils/accessToken'
import store from '@src/store'
import router from '@src/router'

const fetchPost = (url, body) => {
  let token = getAccessToken()
  token = token ? `${setting.authorization_name} ${token}` : ''
  return new Promise((resolve, reject) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        // TODO: 在这里使用return reject(response)抛出错误无效，为什么？？？
        // TODO: 在then或者try中抛出错误，只能使用以下2种方法 throw 或者 return Promise.reject
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
      .catch((err) => {
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
