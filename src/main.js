import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueSocketIO from 'vue-socket.io'
import moment from 'moment'

// import store from './store/index.js'
import config from '../config'
import './assets/global.css'

Vue.prototype.moment = moment

Vue.use(new VueSocketIO({
    debug: false,
    connection: config.webhook_worker.uri,
    // vuex: {
    //     store,
    //     actionPrefix: 'SOCKET_',
    //     mutationPrefix: 'SOCKET_'
    // }
}))

Vue.use(VueMaterial)
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.config.productionTip = false

import List from './components/List.vue'
import Logs from './components/Logs.vue'
Vue.component('List', List);
Vue.component('Logs', Logs);

const Home            = { template: '<Logs title="Logs" endpoint="/logs" id="log-list"/>' }
const StockApproved   = { template: '<List title="Gekeurde artikelen" endpoint="/stock/approved" limit="5000" id="stock-approved"/>' }
const StockUnapproved = { template: '<List title="Ongekeurde artikelen" endpoint="/stock/unapproved" limit="5000" id="stock-unapproved"/>' }
const StockExpired    = { template: '<List title="Verlopen artikelen" endpoint="/stock/expired" limit="5000" id="stock-expired"/>' }

const routes = [
  { path: '/', component: Home },
  { path: '/artikelen/gekeurd', component: StockApproved },
  { path: '/artikelen/ongekeurd', component: StockUnapproved },
  { path: '/artikelen/verlopen', component: StockExpired }
]

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes // short for `routes: routes`
})

new Vue({
  render: h => h(App),
  router,
  // store
}).$mount('#app')
