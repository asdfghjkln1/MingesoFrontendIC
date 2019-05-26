<template>
  <div id="Login" class="col-md-4 col-sm-6">
    <h1> Registro </h1>
    <form>
      <div class="form-group">
      <label for="user">Usuario</label>
      <input id="user" class="form-control" type="text" name="user" v-model="username"/>
      </div>
      <div class="form-group">
        <label for="pass">Contraseña</label>
        <input id="pass" class="form-control" type="password" name="pass" v-model="password"/>
      </div>
     <br/>
      <button class="btn btn-primary" type="button" v-on:click="login()">Ingresar</button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';
  const url = 'http://localhost:3000/';
  //const url = 'http://159.65.3.243:8090';
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };
  const axiosInst = axios.create({
    baseURL: url,
    timeout: 10000,
    headers: headers
  });

  export default {
    name: 'Login',
    data() {
      return {
        username: "",
        password: ""
      }
    },
    methods: {
      login() {
        if(this.username === '' || this.password === '') {
          alert("Debe ingresar credenciales válidas");
          return false;
        }
        axiosInst.get('users').then(
          response => {
          if(response.status === 200){
            for(let i = 0; i < response.data.length; i++){
              if(response.data[i].username === this.username && response.data[i].pass === this.password){
                let user = {
                  nombre: response.data[i].username,
                  rol: response.data[i].rol
                };
                localStorage.setItem('usuario', JSON.stringify(user));
                this.$emit("authenticated");
                this.$router.replace({name: "home"});
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
          console.log(error.toString())
        });
      }
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
