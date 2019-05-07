<template>
  <div id="insertar" class="nuevoProducto">
    <div class="container">
    <h1 class="titulo">{{ title }}</h1>
    <div v-if="errors.length">
      Error(es) encontrados:
      <ul> <li v-for="error in errors">{{ error }}</li> </ul>
    </div>
    <div class="form-container">
      <form v-on:submit="sendProducto" id="form-producto">
        <label for="codigo">Codigo producto</label>
        <input input="text" id="codigo" v-bind="this.producto.codigo"><br>
        <label for="nombre">Nombre producto</label>
        <input input="text" id="nombre" v-bind="this.producto.nombre"><br>
        <label for="precio">Precio producto</label>
        <input type="number" id="precio" v-bind="this.producto.precio"><br>
        <label for="categoria">Categoria producto</label>
        <input input="text" id="categoria" v-bind="this.producto.categoria"><br>
        <label for="fecha_exp">Fecha expiración producto</label>
        <input input="date" class="date" id="fecha_exp" v-bind="this.producto.expiracion">
        <input v-on:click="checkfields" id="enviar" class="btn btn-primary" type="submit" value="Enviar">
      </form>
    </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  const url = 'http://159.65.3.243:8090/';
  const axiosInst = axios.create({
    baseURL: url,
    timeout: 10000
  });

export default {
  data () {
    return {
      producto: {
        codigo: '',
        precio: '',
        nombre: '',
        categoria: '',
        expiracion: '',
      },
      errors: [],

      title: 'Ingresar nuevo producto',
    }
  },
  methods: {
    sendProducto(){
      axiosInst.get(url + 'productos/nuevo').then(
        response => {
          if(response.status == 200){
            console.log("Insertado exitósamente")
          }
          else{
            console.log("ERROR STATUS != 200");
          }
        }).catch(error => {
        console.log("Ha ocurrido un error");
        console.log(error.toString())
      })
    },
    checkfields(e){
      e.preventDefault()
      this.errors = [];
      if(this.producto.codigo === ''){
        this.errors.push('Ingrese código');
      }
      if(!this.producto.nombre){
        this.errors.push('Ingrese nombre');
      }
      if(!this.producto.precio){
        this.errors.push('Ingrese precio');
      }
      if(!this.producto.categoria){
        this.errors.push('Ingrese categoria');
      }
      if(!this.producto.expiracion){
        this.errors.push('Ingrese fecha expiración');
      }
      if(this.errors.length === 0){
        return true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .titulo{
    padding: 10px 5px 5px 30px;
  }

  .form-container{
    background-color: #2c3e50;
    padding: 10px;
    -webkit-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
    -moz-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
    box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
  }

  #enviar{
    margin-top: 20px;
    width: 50%
  }

  form *{
    width: 80%;
  }

  .container{
    padding: 50px;
  }

  label{
    left: 0;
    max-width: 50%;
    font-size: 24px;
    color: white;
  }

h1{
  font-size: 48px;
  padding: 5px;
}

</style>
