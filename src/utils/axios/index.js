import httpService from './axios'

/**
 * request请求
 * @param url
 * @param params
 * @param method
 * @returns {Promise<unknown>}
 */
export function request(url, params = {}, method = 'post') {
  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: method,
      data: params
    })
      .then((res = {}) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * post请求
 * @param url
 * @param params
 * @returns {Promise<minimist.Opts.unknown>}
 */
export async function post(url, params = {}) {
  try {
    return await request(url, params, 'post')
  } catch (err) {
    return err
    // TODO: 由于业务调用接口没有使用.catch或try catch，故不能抛出异常；只能return
    // return Promise.reject(err)
  }
}

/**
 * get请求
 * @param url
 * @param params
 * @returns {Promise<minimist.Opts.unknown>}
 */
export async function get(url, params = {}) {
  try {
    return await request(url, params, 'get')
  } catch (err) {
    return err
    // TODO: 由于业务调用接口没有使用.catch或try catch，故不能抛出异常；只能return
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
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  request,
  post,
  get
}
