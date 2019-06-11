import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user.consts.js'
import Vue from 'vue'
import { AUTH_LOGOUT } from '../actions/auth.consts.js'
import axios from 'axios';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};
const axiosInst = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 10000,
  headers: headers
});

const state = { status: '', profile: {} }

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.username,
  isAdmin: state => state.profile.rol === 'Admin',
  profileName: state => state.profile.username + " ( "+state.profile.rol+" )"
}

const actions = {
  [USER_REQUEST]: ({commit, dispatch}, user) => {
    commit(USER_REQUEST)
    axiosInst.get('users')
      .then(resp => {
        if(resp.data[0].token === user.token) //Se debe hacer esta comparacion en el backend...
          commit(USER_SUCCESS, user);
        else
          console.log("Token inválido");
      })
      .catch(resp => {
        commit(USER_ERROR)
        // if resp is unauthorized, logout, to
        dispatch(AUTH_LOGOUT)
      })
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
