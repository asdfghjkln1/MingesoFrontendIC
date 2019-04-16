<template>
  <div id="listado">
    <div class="container">
      <div class="row">
        <h2>Lista productos</h2>
      </div>
      <div class="row table-responsive">
        <table class="table">
          <tr>
            <th>Código</th>
            <th>Nombre Producto</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Fecha Expiración</th>
          </tr>
        <tbody class="table table-hover">
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
  export default{
    name: 'ListaProductos',
    data(){
      return {
        productos: [],
        error: ''
      }
    },
    created() {
      //this.fetchProductos();
    },
    methods: {
      fetchProductos(){
        this.http.get('http://localhost:8090/productos', function(data, status){
          if(status == 200){
            this.productos = data;
          }
          else{
            console.log("ERROR FETCH (temporal)");
          }
        });
      },
      filtrarCategoria(categoria){
        this.http.get('http://localhost:8090/productos/categoria', function(data, status){
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
