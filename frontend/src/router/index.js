import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import InfoReserva from '@/components/InfoReserva'
import Rack from '@/components/Rack'
import RegistroReservas from '@/components/RegistroReservas'
import Habitaciones from '@/components/Habitaciones'
import Login from '@/components/Login'

Vue.use(Router);

const router = new Router({
    routes : [
      { name: 'home', path: '/', component: LandingPage , meta: { requiresAuth: false}},
      { name: 'rack', path: '/rack', component: Rack, meta: { requiresAuth: false}},
      { name: 'reservas', path: '/reservas/:codigo', component: InfoReserva, meta: { requiresAuth: true}},
      { name: 'registros', path: '/registros', component: RegistroReservas, meta: { requiresAuth: true}},
      { name: 'habitaciones', path: '/habitaciones', component: Habitaciones, meta: { requiresAuth: true}},
      { name: 'login', path: '/login', component: Login, meta: { requiresAuth: false }}
      ]
});
  

router.beforeEach((to, from, next) => {
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
});

export default router;
