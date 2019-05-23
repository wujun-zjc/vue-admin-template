import request from '@/utils/request'

//基地名称
export function baseName(id) {
  return request({
    url: '/plantBaseInterfaceService/getList',
    method: 'post',
    data: {
      "so_id": id
    }
  })
}
//列表展示
export function getPageList(info) {
  return request({
    url: '/alarmUserInterfaceService/getPageList',
    method: 'post',
    data: info
  })
}
//树结构
export function getTreeData(id) {
  return request({
    url: '/enterpriseInterfaceService/getOrgTree',
    method: 'post',
    data: {
      "so_id": id
    }
  })
}
//消息类型
