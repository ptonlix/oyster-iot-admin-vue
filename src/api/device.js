import request from '@/utils/request'

export function listForAllNum() {
  return request({
    url: '/api/device/listforallnum',
    method: 'get'

  })
}
