import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import InfoReserva from '@/components/InfoReserva'
import Rack from '@/components/Rack'

Vue.use(Router)

const routes = [
  { path: '/', component: LandingPage },
  { path: '/rack', component: Rack},
  { path: '/reservas/*', component: InfoReserva}
]

export default new Router({
  routes
})
