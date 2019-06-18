<template>
  <div id="Login" class="col-md-4 col-sm-6">
    <h1> Registro </h1>
    <form>
      <div class="form-group">
      <label for="user">Usuario</label>
      <input required id="user" class="form-control" type="text" name="user" v-model="username"/>
      </div>
      <div class="form-group">
        <label for="pass">Contraseña</label>
        <input required id="pass" class="form-control" type="password" name="pass" v-model="password"/>
      </div>
     <br/>
      <button class="btn btn-primary" type="button" v-on:click="login">Ingresar</button>
    </form>
  </div>
</template>

<script>
  import {AUTH_REQUEST} from '../store/actions/auth.consts.js'
  export default {
    name: 'Login',
    data() {
      return {
        username: "",
        password: "",
      }
    },
    methods: {
      login() {
        if (this.username === '' || this.password === '') {
          alert("Debe ingresar credenciales válidas");
          return false;
        }
        const user = {
          usuario: this.username,
          password: this.password,
          rol: "administrador"
        };
        this.$store.dispatch(AUTH_REQUEST, user).then(() => {
          this.$router.push('/');
        })
      },
    }
  }
</script>

<style scoped>
  #Login {
    padding: 30px;
    float: none;
    margin: 0 auto;
  }
  .form-control{
    margin-left: auto;
    padding: 10px 70px 10px 70px;
  }
</style>
