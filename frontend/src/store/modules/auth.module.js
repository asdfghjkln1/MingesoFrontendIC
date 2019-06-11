/* eslint-disable promise/param-names */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth.consts'
import { USER_REQUEST } from '../actions/user.consts.js'
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

const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}
const state = { token: token || '', status: '', hasLoadedOnce: false }

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      axiosInst.get('users').then(
        response => {
          if(response.status === 200){
            for(let i = 0; i < response.data.length; i++){
              if(response.data[i].username === user.username && response.data[i].password === user.password){
                /*let user = {
                  nombre: response.data[i].usuario,
                  rol: response.data[i].rol
                };*/
                //localStorage.setItem('usuario', JSON.stringify(user));
                let token = response.data[i].token;
                localStorage.setItem('user-token', token);
                console.log("token: "+token);
                axios.defaults.headers.common['Authorization'] = token;
                commit(AUTH_SUCCESS, response.data[i]);
                dispatch(USER_REQUEST, response.data[i]);
                resolve(response);
                //this.$emit("authenticated");
                return true;
              }
            }
            alert("El usuario y/o la contraseña son incorrectos");
            return false;
          } else if(response.status !== 200){
            console.log("ERROR INTERNO");
          }
        }).catch(error => {
        console.log("Ha ocurrido un error");
        commit(AUTH_ERROR, error)
        localStorage.removeItem('user-token')
        reject(error)
      });

        /*.then(resp => {
          localStorage.setItem('user-token', resp.token);
          // Here set the header of your ajax library to the token value.
          // example with axios
          // axios.defaults.headers.common['Authorization'] = resp.token
          commit(AUTH_SUCCESS, resp)
          dispatch(USER_REQUEST)
          resolve(resp)
        })
        .catch(err => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          reject(err)
        })*/
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
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp.token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
