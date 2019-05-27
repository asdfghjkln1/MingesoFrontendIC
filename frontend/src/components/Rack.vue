<template>
  <div id="Scheduler">
    <div class="component-container">
      <h2 id="rack-title">Rack de reservas</h2>
      <div class="row">
        <div class=" offset-lg-1 offset-md-2 form-group col-lg-2 col-md-4">
          <label for="inicio">Inicio Rack</label>
          <input class="form-control" type="date" id="inicio" v-on:change="DateChange">
        </div>
        <div class="form-group col-lg-2 col-md-4">
          <label for="inicio">Fin Rack</label>
          <input class="form-control" type="date" id="fin" v-on:change="DateChange">
        </div>
        <div class="col-lg-3 col-md-6">
          <label for="filtro1">Filtro por código</label>
          <input id="filtro1" class="form-control" v-model="filtro_codigo" placeholder="Ingresar código de la reserva..." v-on:change="filtroCodigo">
        </div>
        <div class="col-lg-3 col-md-6">
          <label for="filtro2">Filtro por nombre</label>
          <input id="filtro2" class="form-control" v-model="filtro_nombre" placeholder="Ingresar nombre del representante..." v-on:change="filtroNombre">
        </div>
      </div>
      <div class="scheduler-container row">
        <div class="col-lg-12 col-md-12">
        <DayPilotScheduler id="dp" :config="config" ref="scheduler" />
        </div>
      </div>
      <!--
      <form v-if="checkAdmin" class="row">
        <h6> Nueva habitación</h6>
        <br>
        <div class="form-group">
          <label for="num_habitacion">Identificación de la habitación</label>
          <input class="form-control" id="num_habitacion" placeholder="Ej. 103, A305, etc" v-model="num_hab">
        </div>
        <div class="form-group">
          <label for="tipo_habitacion">Tipo habitación</label>
          <input class="form-control" id="tipo_habitacion" placeholder="Ej. Simple, Doble, etc" v-model="tipo_hab">
        </div>
        <button role="button" type="submit" id="btn_nueva_hab"> Confirmar </button>
      </form>
      -->
      <div class="row">
        <div class="col-lg-8 col-md-10">
          <TablaPrecios :precios="precios" v-on:editarTipo="editTipo" v-on:eliminarTipo="deleteTipo" v-on:nuevoTipo="newTipo"></TablaPrecios>
        </div>
      </div>
    </div>
    <ModalReserva v-on:confirm="nuevaReserva" v-bind:selected="selectedRange" v-bind:habitaciones="habitaciones" v-show="insertModalVisible" @close="closeModal"/>
  </div>
</template>

<script>
  import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue';
  import ModalReserva from './ModalReserva';
  import TablaPrecios from './PriceTable';
  import axios from 'axios';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };
  const url = 'http://localhost:8090/mingesoback/';
  const urlTest = "http://127.0.0.1:3000/";
  const axiosInst = axios.create({
    baseURL: url,
    timeout: 10000,
    headers: headers
  });

  const axiosTest = axios.create({
    baseURL: urlTest,
    timeout: 10000,
    headers: headers
  });

  /*var fechas = $('#fechas').daterangepicker({
    opens: 'left'
  }, function(start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
  });*/

  export default {
    name: 'Scheduler',
    props: [ "rol" ],
    data: function() {
      return {
        //
        insertModalVisible: false,
        selectedRange: [],
        resources : [],
        habitaciones: [],
        events: [],
        precios: [],
        // Para nueva habitacion
        tipo_hab: '',
        num_hab: '',
        //Para filtros
        filtro_codigo: '',
        filtro_nombre: '',
        // Daypilot
        config: {
          locale: "es-es",
          cellWidthSpec: "Fixed",
          cellWidth: 100,
          autoScroll: "Always",
          timeHeaders: [{"groupBy":"Month"},{"groupBy":"Day","format":"d"}],
          scale: "Day",
          days: DayPilot.Date.today().daysInMonth(),
          startDate: DayPilot.Date.today().firstDayOfMonth(),
          businessWeekends: true,
          eventHeight: 50,
          eventMovingStartEndEnabled: true,
          allowEventOverlap: false,
          timeRangeSelectedHandling: "Enabled",
          allowMultiRange: true,
          onTimeRangeSelected: function (args) {
            console.log(args);
            //Cargar datos al modal
            this.selectedRange = args.multirange;
            //Abrir modal
            this.showModal();
          }.bind(this),
          eventMoveHandling: "Update",
          onEventMoved: function (args) {
            this.message("Event moved: " + args.e.text());
          },
          eventResizeHandling: "Update",
          onEventResized: function (args) {
            this.message("Event resized: " + args.e.text());
          },
          eventDeleteHandling: "Update",
          onEventDeleted: function (args) {
            this.message("Event deleted: " + args.e.text());
          },
          eventClickHandling: "Select",
          onEventEdited: function (args) {
            this.message("Event selected: " + args.e.text());
          },
          eventHoverHandling: "Bubble",
          bubble: new DayPilot.Bubble(),
          contextMenu: new DayPilot.Menu({
            items: [
              {
                text: "Cancelar reserva", onClick: function(args) {
                var dp = args.source.calendar; dp.events.remove(args.source);
                }
              },
              {
                text: "Edit", onclick: function() {
                  dp.events.edit(this.source);
                }
              },
              {
                text: "Ir a reserva", onclick: function( args ) {
                  //Esto no funciona.
                  this.$route.push("/reservas/" + args.data.codigo);
                }
              }]
          }),
          treeEnabled: true,
          rowHeaderWidth: 120,
          rowHeaderWidthAutoFit: false,
          rowMinHeight: 50,
          onBeforeEventRender: function(args) {
            if(args.data.tipo === "Empresa"){
              args.data.barColor = "red";
            }else if(args.data.tipo === "Particular"){
              args.data.barColor = "blue";
            }
            args.data.bubbleHtml = "<div><b>Codigo reserva: " + args.data.codigo + "</b></div>" +
              "<div>Tipo reserva: " + args.data.tipo + "</div>" +
              "<div>Fecha realizado: " + args.data.fecha +"</div>" +
              "<div>Valor: " + args.data.total + "</div>" +
              "<br>" +
              "<a href='/reservas/"+ args.data.codigo +"'>Ir a la reserva</a>" //"<router-link :to=\"{ name: 'reservas', params: { codigo_reserva: '" + args.data.codigo + "'}}\"> Ir a reserva </router-link>";
          },
          rowHeaderColumns : [{
            html: 'Habitación', //No funciona
            width: 150
          }, {
            text: 'Tamaño', //No funciona
            width: 50
          }, {
            title: 'Estado', //No funciona
            width: 60
          }]
        },
      }
    },
    components: {
      DayPilotScheduler,
      ModalReserva,
      TablaPrecios
    },
    computed: {
      // DayPilot.Scheduler object - https://api.daypilot.org/daypilot-scheduler-class/
      scheduler: function () {
        return this.$refs.scheduler.control;
      },
      checkAdmin(){
        let user = localStorage.getItem('usuario');
        if(user){
          return JSON.parse(user).rol === 'Admin';
        } else return false;
      }
    },
    methods: {
      nuevaReserva( reservas ){
        console.log( reservas );
        for(let reserva in reservas){
          axiosInst.post("reserva/insert", reserva).then(
            response => {
              if(response.status === 200) {
                alert("Insertado con éxito");
                this.loadEvents();
              }
            }).catch( error => {
              console.log(error.toString());
            }
          );
        }

      },
      filtroCodigo(){
        console.log("Filtrando por codigo: "+this.filtro_codigo);
        axiosTest.get("/reservas/codigo/"+this.filtro_codigo).then(
          response => {
            if(response.status === 200){
              self.events = response.data;
              this.scheduler.update({events : self.events});
            }
        }).catch( error => {
          console.log(error.toString());
        });
      },
      filtroNombre(){
        console.log("Filtrando por nombre: "+this.filtro_nombre);
        axiosTest.get("/reservas/nombre/"+this.filtro_nombre).then(
          response => {
            if(response.status === 200){
              self.events = response.data;
              this.scheduler.update({events : self.events});
            }
          }).catch( error => {
          console.log(error.toString());
        });
      },
      editTipo(){
        alert("No implementado.");
      },
      newTipo( tipo ){
        axiosTest.post("/tipo/"+tipo.tipo+"/"+tipo.precio).then(
          response => {
            if(response.status === 200){
              alert("Agregado con éxito");
            }
          }
        ).catch( error => {
          console.log(error.toString());
        });
      },
      deleteTipo( index ){
        axiosTest.post("/tipo/"+index).then(
          response => {
            if(response.status === 200){
              alert("Eliminado con éxito");
            }
          }
        ).catch( error => {
          console.log(error.toString());
        });
      },
      showModal() {
        this.insertModalVisible = true;
      },
      closeModal() {
        this.insertModalVisible = false;
      },
      DateChange() {
        let inicio = document.getElementById("inicio").value;
        let fin = document.getElementById("fin").value;
        if(!inicio || !fin){
          return false;
        }
        if (inicio > fin) {
          alert("Seleccione una fecha válida");
          return false;
        }
        const timeDiff = Math.abs(Date.parse(inicio) - Date.parse(fin));
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        alert("Dias: " + days);
        this.config.days = days + 1;
        this.config.startDate = inicio;
        let todos = this.events;
        this.events = [];
        for (event in todos) {
          if (event.start < fin && event.end > inicio) {
            this.events.push(event);
          }
        }
        //this.loadEvents();
        this.scheduler.update()
      },
      loadInitialRange() {
        let inicio = document.getElementById("inicio");
        let fin = document.getElementById("fin");
        let date_inicio = this.config.startDate;
        let days = this.config.days;
        let date_fin = date_inicio.addDays(days);

        inicio.value = date_inicio.value.split("T")[0];
        fin.value = date_fin.value.split("T")[0];

      },
      loadResources() {
        var self = this;
        axiosTest.get('habitaciones').then(
          response => {
            if(response.status === 200){
              self.habitaciones = response.data;
              this.parseRooms(response.data);
              this.scheduler.update({resources : self.resources});
            }
            else{
              console.log("ERROR STATUS != 200");
            }
          }).catch(error => {
          console.log("Ha ocurrido un error");
          console.log(error.toString())
        });
      },
      parseRooms( habitaciones ) {
        let resources = [];
        //let pisos = [];
        for(let i = 0; i < habitaciones.length; i++){
          let resource = {
            id: habitaciones[i].id,
            name: habitaciones[i].number,
            valor: habitaciones[i].tipo.valor,
            columns: [{
              html: habitaciones[i].tipo.cap
            }]
          };
          resources.push(resource);
        }
        this.resources = resources;
      },
      loadEvents(){
        var self = this;
        axiosTest.get('events').then(
          response => {
            if(response.status === 200){
              self.events = response.data;
              this.scheduler.update({events : self.events});
            }
            else{
              console.log("ERROR STATUS != 200");
            }
          }).catch(error => {
          console.log("Ha ocurrido un error en loadEvents");
          console.log(error.toString())
        });
      },
      loadPrecios(){
        var self = this;
        axiosInst.get('precios').then(
          response => {
            if(response.status === 200){
              self.precios = response.data;
            }
            else{
              console.log("ERROR STATUS != 200");
            }
          }).catch(error => {
          console.log("Ha ocurrido un error en loadPrecios");
          console.log(error.toString())
        });
      }
    },
    mounted: function() {
      this.loadResources();
      this.loadEvents();
      this.loadInitialRange();
      this.loadPrecios();
    }
  }
</script>

<style scoped>
  #rack-title{
    padding: 10px;
    margin-bottom: 10px;
  }
  .component-container{
    padding: 30px 10px 30px 10px;
    margin-top: 20px;
    align-content: center;
  }
  .scheduler-container{
    margin: 20px;
  }
</style>
