<template>
  <div id="app">
    <Navbar v-bind:parent="this"></Navbar>
    <div id="main-container">
      <router-view></router-view>
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
import { USER_REQUEST } from './store/actions/user.consts.js'

export default {
  name: 'App',
  data (){ return {
    subtitle: 'Mingeso B-2 2019 Grupo 1',
    authenticated: false,
    authors: ['Vicente Rivera', 'Sebastián Salazar', 'Francisco Diaz'],
  }},
  created: function () {
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch(USER_REQUEST)
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
  height: 100%;
  object-fit: contain;
  -webkit-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
  -moz-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
  box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
}

input {
  text-align: center;
}
</style>
