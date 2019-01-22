import axios from 'axios'
import {
  Message
} from 'element-ui'
import {
  BASE64,
  utf16to8,
  md5
} from '../assets/js/base64.js'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://platform-show.estar-info.com/server', // api 的 base_url
  timeout: 5000 // 请求超时时间
})

const getBase64 = data => {
  return BASE64.encode(utf16to8(data))
}

// request拦截器
service.interceptors.request.use(
  config => {
    // const timestamp = 1
    // const randomNumber = 1
    // const appId = 'wxd85b5d6d51e9b804'
    // const appSecret =	'88d772e85a86902d09a9be6380a81177'
    const timestamp = Math.round(new Date().getTime() / 1000)
    const randomNumber = Math.floor(Math.random() * 1000)
    const appId = '1'
    const appSecret = '65537'
    let token = appId + timestamp + randomNumber + JSON.stringify(config.data) + appSecret
    token = md5(token).toUpperCase()

    config.url = 'claimDataController.do?' + config.url
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
    return response.data
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
