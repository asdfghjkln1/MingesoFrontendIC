<template>
  <div id="listado">
    <div class="container">
      <div class="row">
        <h2 id="titulo">Registro de reservas</h2>
        <div v-if="loading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-6 form-group">
          <label>Filtro por código</label>
          <input id="filtro-codigo" class="form-control" v-model="filtro_codigo" placeholder="Ingresar código de la reserva..." v-on:change="filtroCodigo">
          <strong v-if="filtrando_por === 'codigo'" style="display: block"> {{ filtro }} </strong>
        </div>
        <div class="col-lg-4 col-md-6 form-group">
          <label>Filtro por nombre</label>
          <input id="filtro-nombre" class="form-control" v-model="filtro_nombre" placeholder="Ingresar nombre del representante..." v-on:change="filtroNombre">
          <strong v-if="filtrando_por === 'nombre'" style="display: block"> {{ filtro }} </strong>
        </div>
      </div>
      <div class="row table-responsive">
        <table class="table table-striped table-stripped">
          <tr>
            <th><div class="sort-by">ID Reserva <i href="#" v-on:click="sortRegistros('id')" class="fas fa-sort"></i></div></th>
            <th><div class="sort-by">Código Reserva <i  href="#" v-on:click="sortRegistros('codigo')" class="fas fa-sort"></i></div></th>
            <th><div class="sort-by">Nombre Representante <i  href="#" v-on:click="sortRegistros('nombre')" class="fas fa-sort"></i></div></th>
            <th><div class="sort-by">Fecha inicio <i  href="#" v-on:click="sortRegistros('start')" class="fas fa-sort"></i></div></th>
            <th><div class="sort-by">Fecha fin <i href="#" v-on:click="sortRegistros('end')" class="fas fa-sort"></i></div></th>
            <th><div class="sort-by">Tipo Reserva <i href="#" v-on:click="sortRegistros('tipo')" class="fas fa-sort"></i></div></th>
            <th><div class="sort-by">Fecha Realizado <i href="#" v-on:click="sortRegistros('fecha')" class="fas fa-sort"></i></div></th>
            <th><div class="sort-by">Total <i href="#" v-on:click="sortRegistros('total')" class="fas fa-sort"></i></div></th>
          </tr>
          <tbody>
          <tr v-for="reserva in reservas">
            <td>{{reserva.id}}</td>
            <td>{{reserva.codigo}}</td>
            <td>{{reserva.nombre}}</td> <!--Cambiar por reserva.nombre-->
            <td>{{reserva.inicio.substring(0, 10)}}</td> <!--Cambiar por reserva.inicio/fin-->
            <td>{{reserva.fin.substring(0, 10)}}</td>
            <td>{{reserva.tipo_Reserva}}</td>
            <td>{{reserva.fecha_reserva.substring(0, 10)}}</td>
            <td>{{reserva.valor}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  const url = 'http://157.230.138.200:8090/mingesoback/';
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };
  const axiosInst = axios.create({
    baseURL: url,
    timeout: 30000,
    headers: headers
  });

  export default{
    name: 'RegistroResevas',
    data(){
      return {
        reservas: [],
        sortActual: '',
        sortDir: 'asc',
        filtro_nombre: '',
        filtro_codigo: '',
        filtro: '',
        filtrando_por: '',
        loading: false
      }
    },
    created() {
      this.fetchReservas();
    },
    methods: {
      async fetchReservas(){
        let self = this;
        this.loading = true;
        await axiosInst.get('reservas').then(
          response => {
            if(response.status === 200){
              self.reservas = response.data; //._embedded.reservas;
            }
            else{
              console.log("ERROR FETCH (temporal)");
            }
          }).catch(error => {
          console.log("Ha ocurrido un error");
          console.log(error.toString())
        });
        this.loading = false;
        //this.marcarCancelados();
      },
      sortRegistros(str){
        if(str === this.sortActual ){
          if(this.sortDir === 'asc')
            this.sortDir = 'desc';
          else this.sortDir = 'asc';
        }
        this.sortActual = str;
        let fact = 1;
        if(this.sortDir === 'desc') fact = -1;
        this.reservas.sort((a, b) => (a[str] > b[str]) ? 1 : (a[str] === b[str]) ? ((a[str] > b[str]) ? fact : -1*fact) : -1*fact );
      },
      async filtroCodigo(){
        this.filtro = "Filtrando por: " + this.filtro_codigo;
        this.filtrando_por = 'codigo';
        let url = "/reservas/codigo/";
        if(this.filtro_codigo === ''){
          url = "/reservas"
        }
        this.loading = true;
        await axiosInst.get(url +this.filtro_codigo).then(
          response => {
            if(response.status === 200){
              this.reservas = response.data;
            }
          }).catch( error => {
          console.log(error.toString());
        });
        this.loading = false;
      },
      async filtroNombre(){
        this.filtro = 'Filtrando por: ' + this.filtro_nombre;
        this.filtrando_por = 'nombre';
        let url = "/reservas/nombre/";
        if(this.filtro_nombre === ''){
          url = "/reservas"
        }
        this.loading = true;
        await axiosInst.get(url + this.filtro_nombre).then(
          response => {
            if(response.status === 200){
              this.reservas = response.data;
              
            }
          }).catch( error => {
          console.log(error.toString());
        });
        this.loading = false;
      },
      /*marcarCancelados(){
        let elements = document.getElementsByClassName("status");
        console.log(elements);
        for (let i = 0; i < elements.length; i++) {
          if(element[i].innerText === 'Cancelado'){
            console.log(element[i].parentElement);
            element[i].parentElement.className += "table-danger";
          }
        }
      }*/
    },
  }
</script>
<style scoped>
  #titulo{
    padding: 10px 5px 5px 30px;
  }
  .container{
    padding: 50px;
  }

  th sort-by {
    padding-right: 18px;
    position: relative;
  }
  sort-by:before,
  sort-by:after {
    border: 4px solid transparent;
    content: "";
    height: 0;
    right: 5px;
    top: 50%;
    position: absolute;
    width: 0;
  }
  sort-by:before {
    border-bottom-color: #666;
    margin-top: -9px;
  }
  sort-by:after {
    border-top-color: #666;
    margin-top: 1px;
  }

  fas.fa-sort{
    cursor: pointer;
  }

</style>
