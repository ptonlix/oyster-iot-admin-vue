import request from '@/utils/request'

export function getOperloglist() {
  return request({
    url: '/api/sys/operloglist',
    method: 'get'
  })
}

export function searchOperlog(data) {
  return request({
    url: '/api/sys/operlogsearch',
    method: 'post',
    data
  })
}

export function deleteOperlog(data) {
  return request({
    url: '/api/sys/operlogdelete',
    method: 'post',
    data
  })
}

export function getSyslogFileList() {
  return request({
    url: '/api/sys/sysloglist',
    method: 'get'
  })
}

export function getSyslogFileContext(params) {
  return request({
    url: '/api/sys/syslogcontext',
    method: 'get',
    params
  })
}
