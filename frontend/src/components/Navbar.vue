<template>
  <div id="nav">
    <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></head>
    <nav class="navbar navbar-dark bg-dark">
      <nav id="navbar" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a id="titulo" class="navbar-brand" href="/">Plataforma Integración continua</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#items" aria-controls="items" aria-expanded="true" aria-label="Abrir navegación">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse show" id="items">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <router-link to="/rack" class="nav-link">Rack</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/registros" class="nav-link">Registro de reservas</router-link>
            </li>
            <li class="nav-item">
              <router-link  class="nav-link" to="/habitaciones">Habitaciones</router-link>
            </li>
            <li v-if="isAuthenticated" class="nav-item">
              <p class="nav-link">{{ profileName }}</p>
            </li>
            <li v-if="isAuthenticated" class="nav-item">
              <div id="logout-button" class="nav-link" v-on:click="logout">Salir</div>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/login">Ingresar</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </nav>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from "../store/actions/auth.consts.js";
import { mapGetters, mapState} from "vuex";

export default {
  name: 'Nav',
  data: function() {
    return {
    }
  },
  methods: {
    logout(){
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
    },
  },
  computed: {
    ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded', 'profileName']),
    /*...mapState({
      name: state => `${state.profile.username} (${state.profile.rol})`,
    }),*/
  }
}
</script>

<style>
#navbar{
  width: 100%;
  position: sticky;
}
.nav-link{
  margin-left: 30px;
}
#buscar{
  margin-left: 5%;
}

#titulo{
  margin-right: 100px;
}

</style>
