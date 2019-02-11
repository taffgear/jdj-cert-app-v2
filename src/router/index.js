import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import List from '@/components/List'
import Logs from '@/components/Logs'
import Settings from '@/components/Settings'
import Uploader from '@/components/Uploader'

Vue.component('List', List)
Vue.component('Logs', Logs)
Vue.component('Settings', Settings)
Vue.component('Uploader', Uploader)

const Home            = { template: '<Logs title="Logs" endpoint="/logs" id="log-list"/>' }
const StockApproved   = { template: '<List title="Gekeurde artikelen" endpoint="/stock/approved" limit="5000" id="stock-approved"/>' }
const StockUnapproved = { template: '<List title="Ongekeurde artikelen" endpoint="/stock/unapproved" limit="5000" id="stock-unapproved"/>' }
const StockExpired    = { template: '<List title="Verlopen artikelen" endpoint="/stock/expired" limit="5000" id="stock-expired"/>' }
const Certificaten    = { template: '<Uploader title="Certificaten uploaden"/>' }

Vue.use(Router)

const routes = [
  {
    path: "/index.html",
    redirect: "/"
  },
  {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
          requiresAuth: true
      }
  },
  {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
          guest: true
      }
  },
  {
      path: '/instellingen',
      name: 'settings',
      component: { template: '<Settings title="Instellingen"/>' },
      meta: {
          requiresAuth: true
      }
  },
  {
      path: '/certificaten',
      name: 'certificates',
      component: Certificaten,
      meta: {
          requiresAuth: true
      }
  },
  {
      path: '/artikelen/gekeurd',
      name: 'articles_approved',
      component: StockApproved,
      meta: {
          requiresAuth: true
      }
  },
  {
      path: '/artikelen/ongekeurd',
      name: 'articles_unapproved',
      component: StockUnapproved,
      meta: {
          requiresAuth: true
      }
  },
  {
      path: '/artikelen/verlopen',
      name: 'articles_expired',
      component: StockExpired,
      meta: {
          requiresAuth: true
      }
  }
]

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('jwt') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            let user = JSON.parse(localStorage.getItem('user'))

            if (to.matched.some(record => record.meta.is_admin)) {
                if (user.is_admin == 1)
                    next()
                else
                    next({ name: 'home'})
             } else {
                 next()
             }
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.getItem('jwt') == null)
            next()
        else
            next({ name: 'home'})
    } else {
        next()
    }
})

export default router
