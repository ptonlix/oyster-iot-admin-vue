import request from '@/utils/request'

export function listSpaceAndUsers() {
  return request({
    url: '/api/video/space/listanduser',
    method: 'get'

  })
}

export function listVideoDevices(params) {
  return request({
    url: '/api/video/list',
    method: 'get',
    params
  })
}

export function getVideoDevice(params) {
  return request({
    url: '/api/video/getdevice',
    method: 'get',
    params
  })
}

export function getVideoPlayURL(params) {
  return request({
    url: '/api/video/geturls',
    method: 'get',
    params
  })
}

export function listSpace(params) {
  return request({
    url: '/api/video/space/list',
    method: 'get',
    params
  })
}

export function addSpace(data) {
  return request({
    url: '/api/video/space/add',
    method: 'post',
    data
  })
}

export function editSpace(data) {
  return request({
    url: '/api/video/space/edit',
    method: 'post',
    data
  })
}

export function deleteSpace(data) {
  return request({
    url: '/api/video/space/delete',
    method: 'post',
    data
  })
}

export function getRecordList(params) {
  return request({
    url: '/api/video/getrecordlist',
    method: 'get',
    params
  })
}

export function queryRecordCalendar(params) {
  return request({
    url: '/api/video/getrecordcalendar',
    method: 'get',
    params
  })
}
