<template>
  <div id="TablaPrecios">
    <table class="table table-striped table-stripped">
      <thead class="thead-dark">
      <tr>Precios habitaciones</tr>
      <tr>
        <td>Tamaño</td>
        <td>Precio por noche</td>
        <td>Accion</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(precio, index) in precios">
        <td><input v-model="precio.tipo" v-bind:disabled="disabled"></td>
        <td>$ <input v-model="precio.precio" v-bind:disabled="disabled" v-on:change="editTipo(this, index)"></td>
        <td><i class="far fa-edit" role="button" @click="disabled = !disabled"></i><i class="fas fa-trash-alt" role="button" @click="deleteTipo(precio.id)"></i></td>
      </tr>
      <tr>
        <td><input v-model="tipo" placeholder="Nueva habitación"></td>
        <td><input v-model="precio" placeholder="Precio"></td>
        <td><i class="fas fa-plus" role="button" v-on:click="nuevoTipo"></i></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: "TablaPrecios",
    props: [ "precios"],
    data: function() {
      return {
        disabled: true,
        tipo: '',
        precio: '',
      }
    },
    methods: {
      deleteTipo(index){
        this.$emit("eliminarHabitacion", index);
      },
      editTipo(price, index){
        let newprice = this.precios[index].precio;
        console.log(newprice);
        this.$emit("editarPrecio", this.precios[i]);
      },
      nuevoTipo(){
        if(this.tipo !== '' && this.precio !== ''){
          let precio =  parseInt(this.precio);
          let nuevo = {
            tipo: this.tipo,
            precio: precio
          };
          console.log(nuevo);
          this.$emit('nuevoTipo', nuevo);
        }
      }
    }
  }
</script>

<style>
  #TablaPrecios{
    padding: 20px;
  }
</style>
