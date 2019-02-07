import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Notifications from 'vue-notification'
import VueProgressBar from 'vue-progressbar'
import Vuelidate from 'vuelidate'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'typeface-roboto/index.css'

import VueSocketIO from 'vue-socket.io'
import moment from 'moment'

import config from '../config'
import './assets/global.css'
import axios from './api-axios'

Vue.prototype.moment = moment
Vue.prototype.$api = axios
Vue.prototype.$config = config

Vue.use(new VueSocketIO({
    debug: false,
    connection: config.webhook_worker.uri
}))

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
Vue.use(VueRouter)
Vue.use(Notifications)
Vue.config.productionTip = false

import List from './components/List.vue'
import Logs from './components/Logs.vue'
import Settings from './components/Settings.vue'
import Uploader from './components/Uploader.vue'
Vue.component('List', List)
Vue.component('Logs', Logs)
Vue.component('Settings', Settings)
Vue.component('Uploader', Uploader)

const Home            = { template: '<Logs title="Logs" endpoint="/logs" id="log-list"/>' }
const StockApproved   = { template: '<List title="Gekeurde artikelen" endpoint="/stock/approved" limit="5000" id="stock-approved"/>' }
const StockUnapproved = { template: '<List title="Ongekeurde artikelen" endpoint="/stock/unapproved" limit="5000" id="stock-unapproved"/>' }
const StockExpired    = { template: '<List title="Verlopen artikelen" endpoint="/stock/expired" limit="5000" id="stock-expired"/>' }
const Certificaten    = { template: '<Uploader title="Certificaten uploaden"/>' }

const routes = [
  { path: '/', component: Home },
  { path: '/instellingen', component: { template: '<Settings title="Instellingen"/>' } },
  { path: '/certificaten', component: Certificaten },
  { path: '/artikelen/gekeurd', component: StockApproved },
  { path: '/artikelen/ongekeurd', component: StockUnapproved },
  { path: '/artikelen/verlopen', component: StockExpired }
]

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes // short for `routes: routes`
})

export default new Vue({
  render: h => h(App),
  router,
  // store
}).$mount('#app')
