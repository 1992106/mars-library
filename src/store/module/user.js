import request from '@utils/request'
import { setAccessToken, getAccessToken, removeAccessToken } from '@utils/accessToken'
import { isEmpty } from '@utils'

const getLocalUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo'))
  } catch (error) {
    return {}
  }
}

const user = {
  state: {
    userInfo: getLocalUserInfo(),
    token: getAccessToken()
  },
  getters: {
    nickname: (state) => state.userInfo.nickname
  },
  mutations: {
    setUserInfo(state, userInfo) {
      isEmpty(userInfo)
        ? localStorage.removeItem('userInfo')
        : localStorage.setItem('userInfo', JSON.stringify(userInfo))
      state.userInfo = userInfo
    },
    setToken(state, token) {
      isEmpty(token) ? removeAccessToken() : setAccessToken(token)
      state.token = token
    }
  },
  actions: {
    async login({ commit }, payload) {
      const res = await request.post('/mock/login', payload)
      if (!res?.error) {
        const { user: userInfo, token } = res.data
        commit('setToken', token)
        commit('setUserInfo', userInfo)
        return res.data
      }
      return false
    },

    logout({ commit }) {
      commit('setToken', '')
      commit('setUserInfo', {})
      commit('router/reset', null, { root: true })
    }
  }
}

export default user
