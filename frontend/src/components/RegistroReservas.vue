<template>
  <div id="listado">
    <div class="container">
      <div class="row">
        <h2 id="titulo">Registro de reservas</h2>
      </div>
      <div class="row">
        <table class="table table-striped table-stripped">
          <tr>
            <th><div href="#" v-on:click="sortRegistros('id')" class="sort-by">ID reserva</div></th>
            <th><div href="#" v-on:click="sortRegistros('codigo')" class="sort-by">Código Reserva</div></th>
            <th><div href="#" v-on:click="sortRegistros('text')" class="sort-by">Nombre</div></th>
            <th><div href="#" v-on:click="sortRegistros('start')" class="sort-by">Fecha inicio</div></th>
            <th><div href="#" v-on:click="sortRegistros('end')" class="sort-by">Fecha fin</div></th>
            <th><div href="#" v-on:click="sortRegistros('tipo')" class="sort-by">Tipo reserva</div></th>
            <th><div href="#" v-on:click="sortRegistros('fecha')" class="sort-by">Fecha realizado</div></th>
            <th><div href="#" v-on:click="sortRegistros('status')" class="sort-by">Estado reserva</div></th>
            <th><div href="#" v-on:click="sortRegistros('total')" class="sort-by">Total</div></th>
          </tr>
          <tbody>
          <tr v-for="reserva in reservas">
            <td>{{reserva.id}}</td>
            <td>{{reserva.codigo}}</td>
            <td>{{reserva.text}}</td> <!--Cambiar por reserva.nombre-->
            <td>{{reserva.start}}</td> <!--Cambiar por reserva.inicio/fin-->
            <td>{{reserva.end}}</td>
            <td>{{reserva.tipo}}</td>
            <td>{{reserva.fecha}}</td>
            <td class="status">{{reserva.status}}</td>
            <td>{{reserva.total}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  //const url = 'http://localhost:3000';
  const url = 'http://157.230.138.200:8090/mingesoback';
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };
  const axiosInst = axios.create({
    baseURL: url,
    timeout: 10000,
    headers: headers
  });

  export default{
    name: 'RegistroResevas',
    data(){
      return {
        reservas: [],
        sortActual: '',
        sortDir: 'asc',
      }
    },
    created() {
      this.fetchReservas();
    },
    methods: {
      fetchReservas(){
        axiosInst.get('reservas').then(
          response => {
            if(response.status === 200){
              this.reservas = response.data; //._embedded.reservas;
            }
            else{
              console.log("ERROR FETCH (temporal)");
            }
          }).catch(error => {
          console.log("Ha ocurrido un error");
          console.log(error.toString())
        });
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
    display: block;
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

</style>
