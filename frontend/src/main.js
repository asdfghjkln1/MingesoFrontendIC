'use strict'
const Vue = require('vue')
const App = require('/App.vue')
const router = require('./router')

Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
