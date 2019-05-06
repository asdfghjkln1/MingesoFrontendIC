<template xmlns="http://www.w3.org/1999/html">
  <div class="nuevoProducto">
    <h1>{{ title }}</h1>
    <p v-if="errors.length">
      Error(es) encontrados:
      <ul> <li v-for="error in errors">{{ error }}</li> </ul>
    <form v-on:submit="checkfields, sendProducto" id="form-producto">
      <label for="codigo">Codigo producto</label>
      <input input="text" id="codigo" v-bind="producto.codigo">
      <label for="nombre">Nombre producto</label>
      <input input="text" id="nombre" v-bind="producto.nombre">
      <label for="precio">Precio producto</label>
      <input type="number" id="precio" v-bind="producto.precio">
      <label for="categoria">Categoria producto</label>
      <input input="text" id="categoria" v-bind="producto.categoria">
      <label for="fecha_exp">Fecha expiración producto</label>
      <input input="date" class="date" id="fecha_exp" v-bind="producto.expiracion">

      <input type="submit" value="Enviar">
    </form>
  </div>
  <footer>
    <p>Creador por {{subtitle}}:</p><br>
    <ul v-for="author in authors">
      <li>{{author}}</li>
    </ul>
  </footer>
</template>

<script>
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

      subtitle: 'Mingeso B-2 Grupo 1',
      title: 'Ingresar nuevo producto',
      authors: ['Vicente Rivera', 'Sebastián Salazar', 'Francisco Diaz'],
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
      this.errors = [];
      if(!producto.codigo){
        this.errors.push('Ingrese código');
      }
      if(!producto.nombre){
        this.errors.push('Ingrese nombre');
      }
      if(!producto.precio){
        this.errors.push('Ingrese precio');
      }
      if(!producto.categoria){
        this.errors.push('Ingrese categoria');
      }
      if(!producto.expiracion){
        this.errors.push('Ingrese fecha expiración');
      }
      if(this.errors.length === 0){
        return true
      }
      e.preventDefault()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

footer {
  bottom: 0;
  width: 100%;
  background-color: #2c3e50;
  padding: 50px;
  margin: 5px;
}

footer *{
  color: white;
  font-size: 14px;
}

h1{
  font-size: 48px;
  padding: 5px;
}

a {
  color: #42b983;
}
</style>
