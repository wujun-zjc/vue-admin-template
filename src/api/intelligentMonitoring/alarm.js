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
//设备类型
export function getEquipmentList(id) {
  return request({
    url: '/equipmentTypeInterfaceService/getList',
    method: 'post',
    data: {
      "so_id": id
    }
  })
}
//设备参数
export function getEquipmentPermeter(id) {
  return request({
    url: '/equipmentAttributeInterfaceService/getList',
    method: 'post',
    data: {
      "so_id": id
    }
  })
}
//列表展示
export function getPageList(info) {
  return request({
    url: '/alarmInterfaceService/getPageList',
    method: 'post',
    data: info
  })
}
//点击确认操作
export function confirm(id) {
  return request({
    url: '/alarmInterfaceService/saveDispose',
    method: 'post',
    data: {
      "alarmId": id
    }
  })
}
//获取行详细数据
export function getDispose(id) {
  return request({
    url: '/alarmInterfaceService/getDispose',
    method: 'post',
    data: {
      "alarmId": id
    }
  })
}
//点击处理操作
export function modifyDispose(id, status, mode, feed) {
  return request({
    url: '/alarmInterfaceService/modifyDispose',
    method: 'post',
    data: {
      "alarmId": id,
      "disposeStatus": status,
      "disposeExplain": mode,
      "disposeFeedback": feed,
    }
  })
}
