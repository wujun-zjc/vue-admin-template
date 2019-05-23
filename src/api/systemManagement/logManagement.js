import request from '@/utils/request'

export function getModelList(params) {
  return request({
    url: '/logInterfaceService/getInterfaceList',
    method: 'post',
    data: params
  })
}

export function getMethodList(params) {
  return request({
    url: '/logInterfaceService/getMethodList',
    method: 'post',
    data: params
  })
}

export function getLogPageList(params) {
  return request({
    url: '/logInterfaceService/getLogPageList',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/logInterfaceService/delete',
    method: 'post',
    data: params
  })
}
