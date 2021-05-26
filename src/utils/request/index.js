import setting from '@src/config'
import { polyfill } from '@utils'
import store from '@src/store'
import router from '@src/router'
import { message, notification } from 'ant-design-vue'
import { getAccessToken } from '@utils/accessToken'
import XRequest from './request'

if (setting.mock) {
  setting.base_url = ''
}

const createXRequest = () => {
  // 获取token
  const generateAccessToken = () => {
    let token = null
    const { token_storage, token_prefix } = setting

    if (token_storage !== 'cookie') {
      // 先从store内取，取不到则从token_storage上取
      token = store.state.user.token || getAccessToken()
      if (!token) {
        return token
      }

      // 如果有token前缀
      if (token_prefix && token_prefix !== 'null') {
        return `${token_prefix} ${token}`
      }
    }

    return token
  }

  // 自动提示
  const handleError = (err) => {
    if (setting?.request_auto_tips) {
      if ([401, 403].includes(err.status)) {
        notification.warning({
          message: '提示',
          description: err.msg
        })
        store.dispatch('user/logout')
        router.replace('/login')
      } else {
        message.error(err.msg)
      }
    }
  }

  return new XRequest(
    polyfill(
      {
        request_timeout: 10, // 超时时间
        authorization_name: 'Authorization', // token名字{headers: { Authorization: xxxx }}
        base_url: '', // 请求公用前缀('http://www.baidu.com/api')
        onError: handleError, // 自动提示错误
        getToken: generateAccessToken // 获取token的方法，也可以传入token字符串（如果token是字符串，则只在初始化时获取一次，不推荐）
      },
      setting
    )
  )
}

export default createXRequest()
