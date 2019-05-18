'use strict'
const Vue = require('vue')
import App from './App.vue'
import router from './router'

Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
