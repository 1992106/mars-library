const setting = {
  // 标题
  title: 'Mars library',

  // 请求路径
  // base_url: 'http://localhost:8888/api',
  // http://oc.dev.patpat.vip/erp/micro_app/
  // http://oc.dev.patpat.vip
  base_url: 'https://newmars-test.patpat.shop',

  // 是否使用mock
  mock: false,

  // 请求超时
  request_timeout: 10000,

  // 请求时headers内存放token的名字
  authorization_name: 'Authorization',

  // 本地储存token的名字
  token_name: 'mars-scm',

  // token前缀,设置为null则不启用 { headers: { Authorization: 'Bearer ${token}'}}
  token_prefix: 'Bearer',

  // 本地储存token的地方 localStorage || cookie
  token_storage: 'localStorage',

  // 是否开启keep-alive
  keep_alive: true,

  // 顶部进度条
  header_progress: true,

  // iconfont字体URL
  iconfont_url: '//at.alicdn.com/t/font_2581533_qh2ly6e2l0h.js'
}

export default setting
// export { setting as default }
