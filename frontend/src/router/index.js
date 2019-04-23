import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ListaProductos from '@/components/ListaProductos'

Vue.use(Router)

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/productos', component: ListaProductos}
]

export default new Router({
  routes
})
