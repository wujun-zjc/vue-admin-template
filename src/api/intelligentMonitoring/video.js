import request from '@/utils/request'

// 设备id => 基地地块类型
export function getInfo(id) {
  return request({
    url: '/equipmentInterfaceService/get',
    method: 'post',
    data: {
      'id': id
    }
  })
}
// 基地名称
export function baseName(so_id) {
  return request({
    url: '/plantBaseInterfaceService/getList',
    method: 'post',
    data: {
      'organization': so_id
    }
  })
}
// 地块编号
export function plantPlot(id) {
  return request({
    url: '/plantPlotInterfaceService/getList',
    method: 'post',
    data: {
      'baseId': id
    }
  })
}
// 设备类型
export function getTypeList(id) {
  return request({
    url: '/equipmentTypeInterfaceService/getTypeList',
    method: 'post',
    data: {
      plot_id: id,
      type: 1
    }
  })
}
// 设备编号
export function equipmentNums(id, val) {
  return request({
    url: '/equipmentInterfaceService/getList',
    method: 'post',
    data: {
      equipTypeId: id,
      plotId: val
    }
  })
}
export function getAttributes(id) {
  return request({
    url: '/equipmentAttributeInterfaceService/getAttributes',
    method: 'post',
    data: {
      equipId: id
    }
  })
}
