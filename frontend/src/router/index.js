import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import InfoReserva from '@/components/InfoReserva'
import Rack from '@/components/Rack'
import RegistroReservas from '@/components/RegistroReservas'
import Login from '@/components/Login'

Vue.use(Router);

const routes = [
  { name: 'home', path: '/', component: LandingPage },
  { name: 'rack', path: '/rack', component: Rack},
  { name: 'reservas', path: '/reservas/:codigo_reserva', component: InfoReserva},
  { name: 'registros', path: '/registros', component: RegistroReservas},
  { name: 'login', path: '/login', component: Login}
];

export default new Router({
  routes
});
