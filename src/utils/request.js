import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import {
  BASE64,
  utf16to8,
  md5
} from '../assets/js/base64.js'
import {
  getToken
} from '@/utils/auth'
import store from '../store'

// 创建axios实例
const service = axios.create({
  // 'http://platform-show.estar-info.com/server/claimDataController.do?method=getPolicyList&esType=underwriteService'
  // baseURL: 'http://platform-show.estar-info.com/server', // api 的 base_url
  // baseURL: 'http://192.168.30.83:9191/server', // api 的 base_url
  baseURL: 'http://192.168.100.165:9191/rest', // api 的 base_url
  // baseURL: 'http://223.80.100.88:486/rest', // api 的 base_url
  timeout: 45000 // 请求超时时间
})

const getBase64 = data => {
  return BASE64.encode(utf16to8(data))
}

// request拦截器
service.interceptors.request.use(
  config => {
    // 包装data  加入user/timestamp等通用字段
    config.data = {
      data: config.data,
      // timestamp: new Date(),
      user: {
        su_id: getToken()
      }
    }
    // const timestamp = 1
    // const randomNumber = 1
    // const appId = 'wxd85b5d6d51e9b804'
    // const appSecret =	'88d772e85a86902d09a9be6380a81177'
    const timestamp = Math.round(new Date().getTime() / 1000)
    const randomNumber = Math.floor(Math.random() * 1000)
    const appId = '1'
    const appSecret = '65538'
    let token = appId + timestamp + randomNumber + JSON.stringify(config.data) + appSecret
    token = md5(token).toUpperCase()

    // config.url = 'claimDataController.do?' + config.url
    // 请求头
    // axios.defaults.headers.post['Content-Type'] = 'application/jsoncharset=utf-8'
    config.headers['Authorization'] = 'your token'
    config.headers['version'] = '2'
    config.headers['randomNumber'] = randomNumber
    config.headers['timestamp'] = timestamp
    config.headers['appId'] = appId
    config.headers['token'] = token

    // 请求体
    config.data = getBase64(JSON.stringify(config.data))
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 调用非登录接口 , 但是没有用户信息的情况
    if (res.code === 'UNLOGIN') {
      MessageBox.confirm('登录已失效，请重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
