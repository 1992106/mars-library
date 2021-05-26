const setting = {
  // 请求路径
  // base_url: 'http://localhost:8888/api',
  // http://oc.dev.patpat.vip/erp/micro_app/
  base_url: 'http://oc.dev.patpat.vip',

  // 是否使用mock
  mock: true,

  // Modal是否能点击蒙层关闭弹窗
  modal_mask_closable: true,

  // 标题
  title: 'Mars SCM',

  // 本地储存token的名字
  token_name: 'mars-scm',

  // 本地储存token的地方 localStorage || cookie
  token_storage: 'localStorage',

  // 请求超时 (秒)
  request_timeout: 10,

  // 请求错误时是否自动提示
  request_auto_tips: true,

  // 请求时headers内存放token的名字
  authorization_name: 'Authorization',

  // token前缀,设置为null则不启用 { headers: { Authorization: 'Bearer ${token}'}}
  token_prefix: 'Bearer'
}

export default setting
