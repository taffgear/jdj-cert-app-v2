import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connected: false,
    user: (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null),
    jwt: localStorage.getItem('jwt') || null,
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
      login(state, data) {
        state.user  = data.user
        state.jwt   = data.token
        this._vm.$socket.connect()
      },
      logout(state) {
        this._vm.$socket.close()
        localStorage.removeItem('user')
        localStorage.removeItem('jwt')
        state.user = null
        state.jwt = null
        state.logUpdates.counter = 0
        router.push('/login')
      },
      socket_connect (state) {
        state.connected = true
        this._vm.$socket.emit('authenticate', { token: this.state.jwt })
      },
      socket_disconnect (state) {
        state.connected = false
      },
      socket_log (state) {
          if (state.logUpdates.enabled)
            state.logUpdates.counter++
      },
      socket_email (state, data) {
          if (state.emailItems.length)
              state.emailItems = state.emailItems.concat(data)
          else {
              state.emailItems = data
          }
      }
  }
})
