import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/loginInterfaceService/login',
    method: 'post',
    data: {
      // 'user_name': 'admin',
      // 'password': 'd5d9aa051e4bc9fe27d11ef3a0280c3e',
      'user_name': username,
      'password': password,
      'login_type': '0',
      'randomCode': ''
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/loginInterfaceService/getUserInfo',
    method: 'post',
    data: {
      su_id: token
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
