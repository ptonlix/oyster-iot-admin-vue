export const codeStatus = {
  LOGIN_EXPIRE: {
    code: 401,
    message: '登录过期,请重新登录.'
  },
  NOT_PERM: {
    code: 403,
    message: '无权限访问,请联系管理员'
  },
  NOT_SERVER: {
    code: 503,
    message: '服务未启动,请稍后重试'
  },
  NOT_SERVER_API: {
    code: 404,
    message: '请求接口未能找到'
  },
  CAPTCHA_ERR: {
    code: 4000,
    message: '验证码错误'
  },
  LOGIN_ERR: {
    code: 4001,
    message: '账号或密码错误'
  },
  LOGIN_DISABLED: {
    code: 4002,
    message: '登录已失效'
  }
}
