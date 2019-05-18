import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import ListaProductos from '@/components/ListaProductos'
import AgregarProducto from '@/components/NuevoProducto'
import Rack from '@/components/Rack'

Vue.use(Router)

const routes = [
  { path: '/', component: LandingPage },
  { path: '/productos', component: ListaProductos},
  { path: '/producto/agregar', component: AgregarProducto},
  { path: '/rack', component: Rack}
]

export default new Router({
  routes
})
