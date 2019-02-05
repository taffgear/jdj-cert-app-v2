import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/global.css'

import List from './components/List.vue'
import Logs from './components/Logs.vue'
Vue.component('List', List);
Vue.component('Logs', Logs);

import moment from 'moment'
Vue.prototype.moment = moment

Vue.use(VueMaterial)
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.config.productionTip = false

const Home            = { template: '<Logs title="Logs" endpoint="/logs"/>' }
const StockApproved   = { template: '<List title="Gekeurde artikelen" endpoint="/stock/approved" limit="5000"/>' }
const StockUnapproved = { template: '<List title="Ongekeurde artikelen" endpoint="/stock/unapproved" limit="5000"/>' }
const StockExpired    = { template: '<List title="Verlopen artikelen" endpoint="/stock/expired" limit="5000"/>' }

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
  router
}).$mount('#app')
