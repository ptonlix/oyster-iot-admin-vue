import request from '@/utils/request'

export function listForAllNum() {
  return request({
    url: '/api/business/listforallnum',
    method: 'get'

  })
}
