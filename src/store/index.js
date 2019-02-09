import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    jwt: null,
    logUpdates: {
        enabled: true,
        counter: 0
    },
    emailItems: []
  },
  mutations: {
      user (state, user) {
          state.user = user
      },
      jwt (state, jwt) {
          state.jwt = jwt
      },
      toggleLogUpdates (state, enabled) {
          state.logUpdates.enabled = enabled
      },
      resetLogUpdateCounter(state) {
          state.logUpdates.counter = 0
      },
      resetEmailItems(state) {
          state.emailItems = []
      },
      SOCKET_log (state) {
          if (state.logUpdates.enabled)
            state.logUpdates.counter++
      },
      SOCKET_email (state, data) {
          if (state.emailItems.length)
              state.emailItems = state.emailItems.concat(data)
          else {
              state.emailItems = data
          }
      }
  }
})
