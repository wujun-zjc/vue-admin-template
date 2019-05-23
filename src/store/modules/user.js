import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    user: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER: (state, user) => {
      state.user = user
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      // const username = userInfo.username.trim()
      // return new Promise((resolve, reject) => {
      //   login(username, userInfo.password).then(response => {
      //     if (response.success) {
      //       const data = response.obj
      //       setToken(data.su_id)
      //       commit('SET_TOKEN', data.su_id)
      //       resolve()
      //     } else {
      //       reject(response)
      //     }
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })

      // 模拟
      const username = userInfo.username.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        let data = {
          token: ''
        }
        if (username === 'admin') {
          if (password === '123456') {
            data = {
              token: 'admin'
            }
          } else {
            reject({
              msg: '密码错误!'
            })
          }
        } else {
          data = {
            token: username
          }
        }
        setToken(data.token)
        commit('SET_TOKEN', data.token)
        resolve()
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      // return new Promise((resolve, reject) => {
      //   getInfo(state.token).then(response => {
      //     const data = response.obj
      //     if (data.menus && data.menus.length > 0) { // 验证返回的roles是否是一个非空数组
      //       commit('SET_ROLES', data.menus)
      //     } else {
      //       reject('getInfo: menus must be a non-null array !')
      //     }
      //     commit('SET_USER', {
      //       su_id: data.su_id,
      //       so_id: data.so_id,
      //       su_code: data.su_code,
      //       su_name: data.su_name
      //     })
      //     // commit('SET_NAME', data.name)
      //     // commit('SET_AVATAR', data.avatar)

      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })

      // 模拟
      let data = {
        su_id: '1',
        so_id: '1',
        su_code: '',
        su_name: '',
        menus: ['']
      }
      if (state.token === 'admin') {
        data = {
          su_id: '1',
          so_id: '1',
          su_code: 'admin',
          su_name: 'admin',
          menus: ['admin']
        }
      } else {
        data = {
          su_id: '1',
          so_id: '1',
          su_code: state.token,
          su_name: state.token,
          menus: ['notification']
        }
      }
      commit('SET_ROLES', data.menus)
      commit('SET_USER', {
        su_id: data.su_id,
        so_id: data.so_id,
        su_code: data.su_code,
        su_name: data.su_name
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      // return new Promise((resolve, reject) => {
      //   logout(state.token).then(() => {
      //     commit('SET_TOKEN', '')
      //     commit('SET_ROLES', [])
      //     removeToken()
      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
