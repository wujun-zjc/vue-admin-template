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
    roles: []
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
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          // console.log(response.obj)
          // response = {
          //   obj: {
          //     su_id: 'admin',
          //     menus: ['Example', 'Tree', 'Form', 'Test', 'BaseManagement']
          //   }
          // }
          setToken('admin')
          commit('SET_TOKEN', 'admin')
          // const data = response.obj
          // setToken(data.su_id)
          // commit('SET_TOKEN', data.su_id)

          // if (data.menus && data.menus.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.menus)
          // } else {
          //   reject('getInfo: menus must be a non-null array !')
          // }

          // commit('SET_NAME', data.su_name)
          // commit('SET_AVATAR', data.avatar)

          resolve()
          // resolve(data.menus)
        }).catch(error => {
          reject(error)
        })
      })

      // 模拟
      // return new Promise((resolve, reject) => {
      //   const data = {
      //     token: 'admin'
      //   }
      //   setToken(data.token)
      //   commit('SET_TOKEN', data.token)
      //   resolve()
      // })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      // return new Promise((resolve, reject) => {
      //   getInfo(state.token).then(response => {
      //     const data = response.data
      //     if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
      //       commit('SET_ROLES', data.roles)
      //     } else {
      //       reject('getInfo: roles must be a non-null array !')
      //     }
      //     commit('SET_NAME', data.name)
      //     commit('SET_AVATAR', data.avatar)
      //     resolve(response)
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })

      // 模拟
      return new Promise((resolve, reject) => {
        const data = {
          name: 'admin',
          roles: ['admin']
        }
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        resolve({
          data: data
        })
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
      // 模拟
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
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
