<template>
  <div id="app">
    <head>
      <!--<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">-->
    </head>
    <Navbar autenticated="autenticated" @logout="logout"></Navbar>
    <div id="main-container">
      <router-view @autenticated="setAuthenticated"/>
      <footer>
        <p>Creador por {{subtitle}}:</p><br>
        <ul v-for="author in authors">
          <li>{{author}}</li>
        </ul>
      </footer>
    </div>
  </div>
</template>

<!--<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>-->
<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  data (){ return {
    subtitle: 'Mingeso B-2 2019 Grupo 1',
    authenticated: false,
    authors: ['Vicente Rivera', 'Sebastián Salazar', 'Francisco Diaz'],
  }},
  mounted() {
    if(!this.authenticated) {
      this.$router.replace({ name: "login" });
    }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
    },

    logout() {
      this.authenticated = false;
    }
  },
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: azure;
}

footer {
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #2c3e50;
  padding: 50px;
}

footer *{
  color: white;
  font-size: 14px;
}

#main-container{
  margin: 0vh 10vh 0vh 10vh;
  background-color: ghostwhite;
  height: 200vh;
  -webkit-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
  -moz-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
  box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
}

</style>
