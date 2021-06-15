import myFetch from './fetch'

/**
 * post请求
 * @param url
 * @param params
 * @returns {Promise<minimist.Opts.unknown>}
 */
export async function post(url, params = {}) {
  try {
    return await myFetch(url, params, 'POST')
  } catch (err) {
    return err
    // TODO: 由于业务调用接口没有使用.catch或try catch，故不能抛出异常；只能return返回错误，就可以在外层.then或者await中接收错误
    // return Promise.reject(err)
  }
}

/**
 * get请求方法
 * @param url
 * @param params
 * @returns {Promise<minimist.Opts.unknown>}
 */
export async function get(url, params = {}) {
  try {
    return await myFetch(url, params, 'GET')
  } catch (err) {
    return err
    // TODO: 由于业务调用接口没有使用.catch或try catch，故不能抛出异常；只能return返回错误，就可以在外层.then或者await中接收错误
    // return Promise.reject(err)
  }
}

export default {
  request: myFetch,
  post,
  get
}
