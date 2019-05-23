const websocket = {
  state: {
    redataLength: 0
  },
  mutations: {
    GET_REDATALENGTH: (state, length) => {
      state.redataLength = length
    }
  },
  actions: {
    GetRedataLength: ({
      commit
    },
    length) => {
      commit('GET_REDATALENGTH', length)
    }
  }
}

export default websocket
