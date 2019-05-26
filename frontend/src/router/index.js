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
      { name: 'home', path: '/', component: LandingPage , meta: { requiresAuth: true}},
      { name: 'rack', path: '/rack', component: Rack, meta: { requiresAuth: true}},
      { name: 'reservas', path: '/reservas/:codigo_reserva', component: InfoReserva, meta: { requiresAuth: true}},
      { name: 'registros', path: '/registros', component: RegistroReservas, meta: { requiresAuth: true}},
      { name: 'habitaciones', path: '/habitaciones', component: Habitaciones, meta: {requiresAuth: false}},
      { name: 'login', path: '/login', component: Login}
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
