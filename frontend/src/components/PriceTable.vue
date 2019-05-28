<template>
  <div id="TablaPrecios" class="table-responsive">
    <table class="table table-bordered table-striped table-highlight">
      <thead class="thead-dark">
      <tr><td><h4>Precios habitaciones</h4></td></tr>
      <tr>
        <td>Tamaño</td>
        <td>Precio por noche</td>
        <td>Accion</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(precio, index) in precios">
        <td><input v-model="precio.tipo" v-bind:disabled="disabled" v-on:change="editTipo(precio)"></td>
        <td>$ <input v-model="precio.valor" v-bind:disabled="disabled" v-on:change="editTipo(precio)"></td>
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
        console.log(index);
        this.$emit("eliminarTipo", index);
      },
      editTipo(item){
        let newItem = {
          id: item.id,
          tipo: item.tipo,
          precio: parseInt(item.valor)
        };
        console.log(newItem);
        this.$emit("editarTipo", newItem);
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
    },
  }
</script>

<style scoped>
  #TablaPrecios{
    padding: 20px;
  }
</style>
