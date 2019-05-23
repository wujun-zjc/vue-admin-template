import request from '@/utils/request'

export function getRoles(id) {
  return request({
    url: '/plantBaseInterfaceService/getList',
    method: 'post',
    data: {
      'charge': id,
      // 与基地管理页的查询作区分
      'type': 'gis'
    }
  })
}

export function getDevices(id) {
  return request({
    url: '/equipmentInterfaceService/getPlotEquipmentList',
    method: 'post',
    data: {
      'baseId': id
    }
  })
}

export function getEquipmentData(id) {
  return request({
    url: '/equipmentInterfaceService/getEquipmentData',
    method: 'post',
    data: {
      'deviceId': id
    }
  })
}
