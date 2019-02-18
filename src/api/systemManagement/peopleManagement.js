import request from '@/utils/request'

export function getTreeData(name) {
  return request({
    url: 'method=getPolicyList&esType=underwriteService',
    method: 'post',
    data: name
  })
}

export function getTableData(name) {
  return request({
    url: 'method=getPolicyList&esType=underwriteService',
    method: 'post',
    data: name
  })
}
