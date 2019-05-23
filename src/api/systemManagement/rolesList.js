import request from '@/utils/request'
//树结构
export function getTreeData(id) {
  return request({
    url: '/enterpriseInterfaceService/getOrgTree',
    method: 'post',
    data: {
        "so_id":id
    }
  })
}
//角色列表
export function getRoleList(info) {
  return request({
    url: '/roleInterfaceService/getRoleList',
    method: 'post',
    data:info
  })
}
//查看数据
export function getRole(id) {
  return request({
    url: '/roleInterfaceService/getRole',
    method: 'post',
    data:{
      "sr_id":id
    }
  })
}
//新增数据

export function saveRole(info) {
  return request({
    url: '/roleInterfaceService/saveRole',
    method: 'post',
    data:info
  })
}
//修改数据
export function modifyRole(info) {
  return request({
    url: '/roleInterfaceService/modifyRole',
    method: 'post',
    data:info
  })
}

//删除
export function deleteRole(id) {
  return request({
    url: '/roleInterfaceService/deleteRole',
    method: 'post',
    data:{
      "sr_id":id
    }
  })
}