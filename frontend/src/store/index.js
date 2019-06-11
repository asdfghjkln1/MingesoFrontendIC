import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/auth.module.js'
import auth from './modules/user.module.js'

Vue.use(Vuex);
//const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
modules: {
  user,
  auth,
}
  //strict: debug,
})
