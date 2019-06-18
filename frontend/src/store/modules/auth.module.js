/* eslint-disable promise/param-names */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth.consts'
import { USER_REQUEST } from '../actions/user.consts.js'
import axios from 'axios';


const headers = {
  'Access-Control-Allow-Origin': 'http://165.22.249.5',
  'Content-Type': 'application/json'
};
const axiosInst = axios.create({
  baseURL: 'http://157.230.138.200:8090/mingesoback/',
  timeout: 30000,
  headers: headers,
});
const axiosTest = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 10000,
  headers: headers
});

//axios.defaults.headers.common['Origin'] = 'http://165.22.249.5';

const token = localStorage.getItem('user-token')
let loaded = false
if (token) {
  axios.defaults.headers.common['Authorization'] = token
  loaded = true
}
const state = { token: token || '', status: '', hasLoadedOnce: loaded }

const getters = {
  isAuthenticated: state => !!state.token || state.hasLoadedOnce,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      commit(AUTH_LOGOUT)
      axiosInst.post('usuario/login', user).then(
        response => {
          if(response.status === 200){
            /*for(let i = 0; i < response.data.length; i++){
              if(response.data[i].usuario === user.username && response.data[i].password === user.password){
                /*let user = {
                  nombre: response.data[i].usuario,
                  rol: response.data[i].rol
                };*/
                //localStorage.setItem('usuario', JSON.stringify(user));
              let token = response.data;
              if(!token){
                alert("El usuario y/o la contraseña son incorrectos");
                return false;
              }
              localStorage.setItem('user-token', token);
              console.log("token: "+token);
              axios.defaults.headers.common['Authorization'] = token;
              commit(AUTH_SUCCESS, response.data);
              dispatch(USER_REQUEST, user);
              resolve(response);
              //this.$emit("authenticated");
              return true;
            } else if(response.status !== 200){
            console.log("Ha ocurrido un error en el servidor, por favor intente en otro momento...");
          }
        }).catch(error => {
        console.log("Ha ocurrido un error en el servidor, por favor intente en otro momento...");
        commit(AUTH_ERROR, error)
        localStorage.removeItem('user-token')
        reject(error)
      });
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT);
      localStorage.removeItem('user-token');
      delete axios.defaults.headers.common['Authorization'];
      resolve()
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, token) => {
    state.status = 'success';
    state.token = token;
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error';
    state.hasLoadedOnce = true;
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = '';
    state.hasLoadedOnce = false;
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
