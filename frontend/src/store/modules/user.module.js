import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user.consts.js'
import Vue from 'vue'
import { AUTH_LOGOUT } from '../actions/auth.consts.js'
import axios from 'axios';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};
const axiosInst = axios.create({
  baseURL: 'http://157.230.138.200:8090/mingesoback/',
  timeout: 10000,
  headers: headers
});

const state = { status: '', profile: {} }

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.usuario,
  isAdmin: state => state.profile.rol === 'administrador',
  profileName: state => state.profile.usuario + " ( "+state.profile.rol+" )"
}

const actions = {
  [USER_REQUEST]: ({commit, dispatch}, user) => {
    commit(USER_REQUEST)
    axiosInst.get('usuarios')
      .then(resp => {
        if(resp.data[1].token === user.token) //Se debe hacer esta comparacion en el backend...
          commit(USER_SUCCESS, user);
        else
          console.log("Token inválido");
      })
      .catch(resp => {
        commit(USER_ERROR)
        // if resp is unauthorized, logout, to
        dispatch(AUTH_LOGOUT)
      })
    //commit(USER_SUCCESS, user);
  },
}

const mutations = {
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    Vue.set(state, 'profile', resp)
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: (state) => {
    state.profile = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
