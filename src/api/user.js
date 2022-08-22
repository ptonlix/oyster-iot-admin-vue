import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/auth/loginmanage',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/auth/getmanageuserinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/auth/logoutmanage',
    method: 'post'
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/api/user/edit',
    method: 'post',
    data
  })
}

export function listUser(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

export function resetPassword(data) {
  return request({
    url: '/api/user/resetpassword',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/user/delete',
    method: 'post',
    data
  })
}
