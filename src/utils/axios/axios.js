import axios from 'axios'
import setting from '@src/config/index'
import { message } from 'ant-design-vue'
import { getAccessToken } from '@utils/accessToken'
import store from '@src/store'
import router from '@src/router'

const httpService = axios.create()

httpService.defaults.baseURL = !setting.mock ? setting.base_url : ''
httpService.defaults.timeout = setting.request_timeout
httpService.defaults.withCredentials = true

httpService.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers[setting.authorization_name] = `${setting.token_prefix} ${token}`
    }
    console.log(config, 'request config')
    return config
  },
  (error) => {
    console.log(error, 'request error')
    return Promise.reject(error)
  }
)

httpService.interceptors.response.use(
  (response) => {
    console.log(response, 'response success')
    // TODO 本地mock返回的数据格式；真实情况下，需要根据后端返回的数据格式处理
    let data = response.data
    const { code, error } = data
    if (code === -1) {
      message.error(error)
      return Promise.reject(data)
    } else {
      return data
    }
  },
  (error) => {
    if (error && error.response) {
      // TODO: 定义全局错误拦截
      switch (error.response.status) {
        case 403:
          message.error(`登录已过期，重新登录！`)
          store.dispatch('user/logout')
          router.replace('/login')
          break
        case 404:
          message.error(`请求错误,未找到该资源！`)
          break
        default:
          message.error(`未知错误${error.response.status}`)
          break
      }
    } else {
      message.error('连接到服务器失败！')
    }
    console.log(error, 'response error')
    return Promise.reject(error.response)
  }
)

export default httpService
