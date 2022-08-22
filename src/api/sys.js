import request from '@/utils/request'

export function getSysinfo() {
  return request({
    url: '/api/sys/sysinfo',
    method: 'get'
  })
}

export function getEmqmetrisc(data) {
  return request({
    url: '/api/sys/emqmetrisc',
    method: 'get'
  })
}
