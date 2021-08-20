import httpService from './axios'

/**
 * request请求
 * @param url
 * @param params
 * @param method
 * @param options
 * @returns {Promise<unknown>}
 */
export function request(url, params = {}, method = 'post', options = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: method,
      ...(method === 'post' ? { data: params } : {}),
      ...(method === 'get' ? { params: params } : {}),
      options
    })
      .then((res = {}) => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * post请求
 * @param url
 * @param params
 * @param options
 * @returns {Promise<unknown>}
 */
export async function post(url, params = {}, options = {}) {
  try {
    return await request(url, params, 'post', options)
  } catch (err) {
    return err
    // TODO: 由于业务调用接口没有使用.catch或try catch，故不能抛出异常；只能return返回错误，就可以在外层.then或者await中接收错误
    // return Promise.reject(err)
  }
}

/**
 * get请求
 * @param url
 * @param params
 * @param options
 * @returns {Promise<unknown>}
 */
export async function get(url, params = {}, options = {}) {
  try {
    return await request(url, params, 'get', options)
  } catch (err) {
    return err
    // TODO: 由于业务调用接口没有使用.catch或try catch，故不能抛出异常；只能return返回错误，就可以在外层.then或者await中接收错误
    // return Promise.reject(err)
  }
}

/**
 * 文件上传
 * @param url
 * @param params
 * @returns {Promise<unknown>}
 */
export function upload(url, params = {}) {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default {
  request,
  post,
  get
}
