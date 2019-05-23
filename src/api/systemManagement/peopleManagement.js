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
//查询
export function getTableData(info) {
  return request({
    url: '/accountInterfaceService/getUserPageList',
    method: 'post',
    data: info
  })
}
//添加数据
export function addData(info) {
  return request({
    url: '/accountInterfaceService/saveUser',
    method: 'post',
    data:info
  })
}
//删除数据
export function delData(id){
  return request({
    url: '/accountInterfaceService/deleteUser',
    method: 'post',
    data:{
        'su_id':id
    }
  })
}
//编辑、查看获取数据
export function getData(id){
  return request({
    url: '/accountInterfaceService/getUser',
    method: 'post',
    data:{
        'su_id':id
    }
  })
}
//更新
export function modifyData(info){
  return request({
    url: '/accountInterfaceService/modifyUser',
    method: 'post',
    data:info
  })
}
//权限角色
export function getRoles(id){
  return request({
    url: '/roleInterfaceService/getRoles',
    method: 'post',
    data:{
      'so_id':id
  }
  })
}
//重置密码
export function resetPassword(id){
  return request({
    url: '/accountInterfaceService/resetPassword',
    method: 'post',
    data:{
      'su_id':id
  }
  })
}
//启用、禁用
export function Disable(status,id){
  return request({
    url: '/accountInterfaceService/updateStatus',
    method: 'post',
    data:{
      'status':status,
      'su_id':id
  }
  })
}