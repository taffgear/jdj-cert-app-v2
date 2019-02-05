import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    error: '',
    message: '',
    logMessage: '',
    stockItem: '',
    email: '',
    emailSuccess: '',
    emailFailed: ''
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.connected = true
    },
    SOCKET_DISCONNECT(state) {
      state.connected = false
    },
    SOCKET_MESSAGE(state, message) {
      state.message = message
    },
    SOCKET_LOG(state, message) {
      console.log(message);
      state.logMessage = message
    },
    SOCKET_STOCKITEM(state, message) {
      state.stockItem = message
    },
    SOCKET_EMAIL(state, message) {
      state.email = message
    },
    SOCKET_EMAIL_SUCCESS(state, message) {
      state.emailSuccess = message
    },
    SOCKET_EMAIL_FAILED(state, message) {
      state.emailFailed = message
    },
    SOCKET_ERROR(state, message) {
      state.error = message.error
    },
  }
})
