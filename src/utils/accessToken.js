import setting from '@/src/config/index.js'

const { token_name } = setting

const getAccessToken = () => {
  return localStorage.getItem(token_name) || ''
}

const setAccessToken = token => {
  return localStorage.setItem(token_name, token)
}

const removeAccessToken = () => {
  return localStorage.removeItem(token_name)
}

export { getAccessToken, setAccessToken, removeAccessToken }
