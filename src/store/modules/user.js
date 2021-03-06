import request from '@/utils/fetch'
import { resetRouter } from '@/router'
import { setAccessToken, getAccessToken, removeAccessToken, isEmpty } from '@/utils'

const getLocalUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo'))
  } catch (error) {
    return {}
  }
}

const user = {
  state: {
    token: getAccessToken(),
    userInfo: getLocalUserInfo()
  },
  getters: {
    nickname: state => state.userInfo.nickname
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
        const { userInfo, token } = res.result
        commit('setToken', token)
        commit('setUserInfo', userInfo)
        return res.result
      }
      return false
    },
    logout({ commit }) {
      commit('setToken', '')
      commit('setUserInfo', {})
      commit('router/reset', null, { root: true })
      resetRouter()
    }
  }
}

export default user
