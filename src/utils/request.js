import axios from 'axios'
import { Message } from 'element-ui'
import { clearCacheUser, getToken, removeToken } from '@/utils/auth'
import { codeStatus } from '@/utils/constant/codeConstant'
import { resetRouter } from '@/router'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Authorization'] = getToken()
    config.headers['Content-Type'] = 'application/json; charset=utf-8'

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 未能正常响应
    if (res.code !== 200) {
      showErrMsg(res.code, res.msg)
    }
    return res
  },
  (error) => {
    showErrMsg(error.response.status)
    return Promise.reject(error)
  }
)
async function logout() {
  removeToken() // must remove  token  first
  clearCacheUser()
  resetRouter()
  router.push({ path: '/login' })
}

function showErrMsg(code, msg) {
  let message
  if (codeStatus.CAPTCHA_ERR.code === code) {
    message = codeStatus.CAPTCHA_ERR.message
  } else if (codeStatus.LOGIN_ERR.code === code) {
    message = codeStatus.LOGIN_ERR.message
  } else if (codeStatus.LOGIN_DISABLED.code === code) {
    message = codeStatus.LOGIN_DISABLED.message
    logout()
  } else if (codeStatus.LOGIN_EXPIRE.code === code) {
    message = codeStatus.LOGIN_EXPIRE.message
    logout()
  } else if (codeStatus.NOT_PERM.code === code) {
    message = codeStatus.NOT_PERM.message
  } else if (codeStatus.NOT_SERVER.code === code) {
    message = codeStatus.NOT_SERVER.message
  } else if (codeStatus.NOT_SERVER_API.code === code) {
    message = codeStatus.NOT_SERVER_API.message
  }
  Message({
    message: message || msg || 'Request Error',
    type: 'error',
    duration: 5 * 1000
  })
}

export default service
