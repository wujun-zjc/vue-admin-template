import request from '@/utils/request'
// 树结构
export function getTreeData(id) {
  return request({
    url: '/enterpriseInterfaceService/getOrgTree',
    method: 'post',
    data: {
      'so_id': id
    }
  })
}
// 新增
export function addData(info) {
  return request({
    url: '/enterpriseInterfaceService/saveOrg',
    method: 'post',
    data: info
  })
}
// 查看
export function getData(id) {
  return request({
    url: '/enterpriseInterfaceService/getOrg',
    method: 'post',
    data: {
      'so_id': id
    }
  })
}
// 更新
export function modifyData(info) {
  return request({
    url: '/enterpriseInterfaceService/modifyOrg',
    method: 'post',
    data: info
  })
}
// 删除数据
export function delData(id) {
  return request({
    url: '/enterpriseInterfaceService/deleteOrg',
    method: 'post',
    data: {
      'so_id': id
    }
  })
}
