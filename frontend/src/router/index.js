import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import InfoReserva from '@/components/InfoReserva'
import Rack from '@/components/Rack'
import RegistroReservas from '@/components/RegistroReservas'
import Habitaciones from '@/components/Habitaciones'
import Login from '@/components/Login'
import store from '../store' // your vuex store


Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

const router = new Router({
    routes : [
      { name: 'home', path: '/', component: LandingPage },//meta: { requiresAuth: false}},
      { name: 'rack', path: '/rack', component: Rack, beforeEnter: ifAuthenticated},//meta: { requiresAuth: false}},
      { name: 'reservas', path: '/reservas/:codigo', component: InfoReserva, beforeEnter: ifAuthenticated},//meta: { requiresAuth: false}},
      { name: 'registros', path: '/registros', component: RegistroReservas, beforeEnter: ifAuthenticated },//component: RegistroReservas, meta: { requiresAuth: true}},
      { name: 'habitaciones', path: '/habitaciones', component: Habitaciones, beforeEnter: ifAuthenticated},//meta: { requiresAuth: false}},
      { name: 'login', path: '/login', component: Login, beforeEnter: ifNotAuthenticated }//meta: { requiresAuth: false }}
      ]
});


/*router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('usuario')) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});*/

export default router;
