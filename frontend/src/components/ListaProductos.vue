<template>
  <div id="listado">
    <div class="container">
      <div class="row">
        <h2 id="titulo">Listado de productos</h2>
      </div>
      <div class="row">
        <table class="table table-striped table-dark">
          <tr>
            <th>Código</th>
            <th>Nombre Producto</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Fecha Expiración</th>
          </tr>
        <tbody>
          <tr v-for="producto in productos">
            <td>{{producto.codigo}}</td>
            <td>{{producto.nombre}}</td>
            <td>{{producto.precio}}</td>
            <td>{{producto.categoria}}</td>
            <td>{{producto.expiracion}}</td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  const url = 'http://159.65.3.243:8090';
  const axiosInst = axios.create({
    baseURL: url,
    timeout: 10000
  });

  export default{
    name: 'ListaProductos',
    data(){
      return {
        productos: [],
        error: ''
      }
    },
    created() {
      this.fetchProductos();
    },
    methods: {
      fetchProductos(){
        axiosInst.get('productoes').then(
          response => {
            if(response.status == 200){
              this.productos = response.data._embedded.productoes;
            }
            else{
              console.log("ERROR FETCH (temporal)");
            }
          }).catch(error => {
            console.log("Ha ocurrido un error");
            console.log(error.toString())
        })
      },
      filtrarCategoria(categoria){
        axios.get('http://localhost:8090/productoes/categoria', function(data, status){
          if(status == 200){
            this.productos = data;
          }
          else{
            console.log("ERROR FILTRADO (temporal)");
          }
        });
      }
    }

  }
</script>
<style scoped>
  #titulo{
    padding: 10px 5px 5px 30px;
  }
  .container{
    padding: 50px;
  }

  #listado{
    margin: 0vh 10vh 0vh 10vh;
    background-color: ghostwhite;
    height: 100vh;
    -webkit-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
    -moz-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
    box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);

  }
</style>
