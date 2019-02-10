import Vue from 'vue'
import App from './App.vue'
// import VueRouter from 'vue-router'
import Notifications from 'vue-notification'
import VueProgressBar from 'vue-progressbar'
import Vuelidate from 'vuelidate'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'typeface-roboto/index.css'

import VueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'
import moment from 'moment'

import config from '../config'
import './assets/global.css'
import axios from './api-axios'
import router from './router'
import store from './store'

Vue.prototype.moment = moment
Vue.prototype.$api = axios
Vue.prototype.$config = config

const socket = io(config.webhook_worker.uri, {
   reconnection: true,
   autoConnect: !!store.state.jwt,
   query: {
     token: store.state.jwt
   }
 })

Vue.use(new VueSocketIO({
    debug: false,
    connection: socket,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}), store)

const options = {
  thickness: '3px',
  transition: {
    speed: '0.5s',
    opacity: '0.7s',
    termination: 300
  }
}

Vue.use(VueProgressBar, options)
Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(Notifications)
Vue.config.productionTip = false

export default new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
