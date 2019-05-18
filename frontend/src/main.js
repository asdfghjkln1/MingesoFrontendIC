'use strict'
const Vue = require('vue')
const App = require('./App.vue')
const router = require('./router')

/* eslint-disable no-new */
const vue = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
