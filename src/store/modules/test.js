import {
  testReq
} from '@/api/test'

const test = {
  state: {
    testData: 'test'
  },

  mutations: {
    CHANGE_TEST: (state, name) => {
      state.testData = name
    }
  },

  actions: {
    // 登录
    Test({
      commit
    }, name) {
      return new Promise((resolve, reject) => {
        testReq(name).then(response => {
          commit('CHANGE_TEST', name)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
        commit('CHANGE_TEST', name)
      })
    }
  }
}

export default test
