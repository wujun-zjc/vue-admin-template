import request from '@/utils/request'

export function testReq(name) {
  return request({
    url: 'method=getPolicyList&esType=underwriteService',
    method: 'post',
    data: name
  })
}
