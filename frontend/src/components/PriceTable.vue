<template>
  <div id="TablaPrecios" class="table">
    <table class="table table-bordered table-striped table-highlight">
      <thead class="thead-dark">
      <tr>
        <td>
          <h4>Precios habitaciones</h4>
        </td>
      </tr>
      <tr>
        <td><strong>Tipo</strong></td>
        <td><strong>Precio por noche</strong></td>
        <td v-if="isAdmin"><strong>Acción</strong></td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(precio, index) in precios">
        <td><label> {{ precio.tipo}}</label></td>
        <td>$ <input name="tipos" v-model="precio.valor" v-on:change="editTipo(precio)" disabled="true"></td>
        <td v-if="isAdmin">
          <i class="far fa-edit" role="button" @click="activate(index)"></i>
          <i class="fas fa-trash-alt" role="button" @click="deleteTipo(precio.id)"></i>
        </td>
      </tr>
      <tr v-if="isAdmin">
        <td><input v-model="tipo" placeholder="Nuevo tipo de habitación"></td>
        <td>
          <input v-model="precio" @keypress="isNumber($event)" placeholder="Precio">
          <small style="color:red; display:block;">{{numberError}}</small>
        </td>
        <td><input type="button" role="button" class="btn btn-green" v-on:click="nuevoTipo" value="Agregar"></td>
        <!--<td><i class="fas fa-plus" role="button" v-on:click="nuevoTipo"></i></td>-->
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

  import { mapGetters } from "vuex";

  /*function isNumber(evt) {
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
      return false;

    return true;
  }*/

  export default {
    name: "TablaPrecios",
    props: [ "precios" ],
    data: function() {
      return {
        disabled: [],
        tipo: '',
        precio: '',
        numberError: '',
      }
    },
    methods: {
      isNumber: function(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
          evt.preventDefault();;
        } else {
          return true;
        }
      },
      deleteTipo(index){
        let yes = confirm("Seguro desea eliminar este tipo de habitación? No se eliminará si aún existen habitaciones asignadas.");
        if(!yes){
          return;
        }
        this.$emit("eliminarTipo", index);
      },
      editTipo(item){
        let newItem = {
          id: item.id,
          tipo: item.tipo,
          precio: parseInt(item.valor)
        };
        this.$emit("editarTipo", newItem);
      },
      activate(index){
        let fields = document.getElementsByName("tipos");
        let field = fields[index];
        if(!this.disabled[index]){
          field.setAttribute("disabled", "true");
        } else {
          field.removeAttribute("disabled");
        }
        this.disabled[index] = !this.disabled[index];
      },
      nuevoTipo(){
        let yes = confirm("Seguro desea agregar este tipo de habitación?");
        if(!yes){
          return;
        }
        if(isNaN(parseInt(this.precio))){
          this.numberError = "* Ingrese un valor numérico mayor a 0";
          this.precio = '';
          return;
        }
        if(this.tipo !== '' && parseInt(this.precio) > 0){
          this.numberError = '';
          let precio =  parseInt(this.precio);
          let nuevo = {
            tipo: this.tipo,
            precio: precio
          };
          console.log(nuevo);
          this.$emit('nuevoTipo', nuevo);
        }
      },
    },
    mounted: function(){
      this.disabled = Array(this.precios.length).fill(true);
    },
    computed: {
      ...mapGetters(['isProfileLoaded', 'isAdmin']),
    },
  }
</script>

<style scoped>
  #TablaPrecios{
    padding: 20px;
  }
  .fas.fa-trash-alt, .far.fa-edit{
    cursor: pointer;
  }
</style>
