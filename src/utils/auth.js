import Cookies from 'js-cookie'

import { SESSION_KEY } from '@/utils/constant/commonConstants'

const TokenKey = 'oyster_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 存储用户至session中
export const setCacheUser = (user) => {
  sessionStorage.setItem(SESSION_KEY.USER, JSON.stringify(user))
}

// 从session中获取用户
export const getCacheUser = () => {
  const user = sessionStorage.getItem(SESSION_KEY.USER)
  if (user) {
    return JSON.parse(user)
  }
  return null
}

// 从session中移除用户
export const clearCacheUser = () => {
  sessionStorage.removeItem(SESSION_KEY.USER)
}
