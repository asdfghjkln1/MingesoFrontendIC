<template>
  <div id="Scheduler">
    <div class="component-container">
      <h2 id="rack-title">Rack de reservas</h2>
      <div v-if="loading" class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando reservas...</span>
      </div>
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
          <strong v-if="filtrando_por === 'codigo'" style="display: block"> {{ filtro }} </strong>
        </div>
        <div class="col-lg-3 col-md-6">
          <label for="filtro2">Filtro por nombre</label>
          <input id="filtro2" class="form-control" v-model="filtro_nombre" placeholder="Ingresar nombre del representante..." v-on:change="filtroNombre">
          <strong v-if="filtrando_por === 'nombre'" style="display: block"> {{ filtro }} </strong>
        </div>
      </div>
      <div class="scheduler-container row">
        <div class="col-lg-12 col-md-12">
        <DayPilotScheduler id="dp" :config="config" ref="scheduler" />
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8 col-md-10">
          <TablaPrecios :precios="precios" v-on:editarTipo="editTipo" v-on:eliminarTipo="deleteTipo" v-on:nuevoTipo="newTipo"></TablaPrecios>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="card">
            <h3 class="card-header">Instrucciones de uso para el Rack de reservas</h3>
            <div class="card-body">
              <ul id="help">
                <li>Puede seleccionar un período de tiempo para una reserva realizando un click izquierdo y arrastrándolo</li>
                <li>Para seleccionar múltiples reservas, mantenga presionado la tecla "ctrl" para soltar el cursor sin perder la selección</li>
                <li>El tipo de reserva es un campo opcional y puede dejarlo en blanco</li>
                <li>Para eliminar una reserva, presione click derecho y seleccione "cancelar reserva"</li>
              </ul>
            </div>
          </div>
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
  const url = 'http://157.230.138.200:8090/mingesoback/';
  //const url = 'http://localhost:3000';

  const axiosInst = axios.create({
    baseURL: url,
    timeout: 30000,
    headers: headers
  });

  /*var fechas = $('#fechas').daterangepicker({
    opens: 'left'
  }, function(start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
  });*/

  export default {
    name: 'Scheduler',
    data: function() {
      return {
        //
        insertModalVisible: false,
        loading: false,
        selectedRange: [],
        resources : [],
        habitaciones: [], //Para comparar
        reservas: [], //Para comparar
        events: [],
        precios: [],
        // Para nueva habitacion
        tipo_hab: '',
        num_hab: '',
        //Para filtros
        filtro_codigo: '',
        filtro_nombre: '',
        filtrando_por: '',
        filtro: '',
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
            //Cargar datos al modal
            //var dp = this;
            this.selectedRange = args.multirange;
            //Abrir modal
            this.showModal();
            this.scheduler.clearSelection();
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
          eventClickHandling: "ContextMenu",
          onEventEdited: function (args) {
            this.message("Event selected: " + args.e.text());
          },
          eventHoverHandling: "Bubble",
          bubble: new DayPilot.Bubble(),
          contextMenu: new DayPilot.Menu({
            items: [
              {
                text: "Cancelar reserva", onClick: function(args) {
                  let res = confirm("Seguro desea cancelar esta reserva?");
                  if(!res){
                    alert("Se ha cancelado la acción");
                    return false;
                  }
                  //console.log(args.source.data);
                  this.cancelarReserva(args.source.data.id);
                  //var dp = args.source.calendar; dp.events.remove(args.source);
                }.bind(this)
              },
              /*{text:"Edit", onClick: function(args) {
                  var dp = args.source.calendar; dp.events.edit(this.source); } },*/
              {
                text: "Ir a reserva", onClick: function( args ) {
                  this.$router.push("/reservas/" + args.source.data.codigo);
                }.bind(this)
              }]
          }),
          treeEnabled: false,
          rowHeaderWidth: 120,
          rowHeaderWidthAutoFit: false,
          rowMinHeight: 50,
          onBeforeEventRender: function(args) {
            if(args.data.tipo_Reserva === "Empresa"){
              args.data.barColor = "red";
            }else if(args.data.tipo_Reserva === "Particular"){
              args.data.barColor = "blue";
            }else{
              args.data.BackgroundColor = "yellow";
            }
            args.data.bubbleHtml = "<div><b>Codigo reserva: " + args.data.codigo + "</b></div>" +
              "<div>Tipo reserva: " + args.data.tipo_Reserva + "</div>" +
              "<div>Fecha realizado: " + args.data.fecha +"</div>" +
              "<div>Valor: " + args.data.total + "</div>";
            //"<router-link :to=\"{ name: 'reservas', params: { codigo_reserva: '" + args.data.codigo + "'}}\"> Ir a reserva </router-link>";
            //args.data.attr("aria-")
          },
          rowHeaderColumns : [{
            title: "Habitación", //No funciona
            width: 60
          }, {
            title: "Tamaño", //No funciona
            width: 70
          }],
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
    },
    methods: {
      nuevaReserva( reservas ){
        console.log( reservas );
        for(let i = 0; i< reservas.length; i++){
          console.log("Insertando: " + reservas[i]);
          axiosInst.post("reserva/insert", reservas[i]).then(
            response => {
              if(response.status === 200) {
                alert("Reserva registrada con éxito");
                this.insertModalVisible = false;
                this.loadEvents();
              }
            }).catch( error => {
              console.log("Error insertar Num " + i);
              console.log(error);
            }
          );
        }

      },
      filtroCodigo(){
        let self = this;
        this.filtro = 'Filtrando por: ' + this.filtro_codigo;
        this.filtrando_por = "codigo";
        axiosInst.get("/reservas/codigo/"+this.filtro_codigo).then(
          response => {
            if(response.status === 200){
              self.reservas = response.data;
              this.parseReservas(response.data);
              self.scheduler.update({ events : self.events});
            }
        }).catch( error => {
          console.log(JSON.stringify(error));
        });
      },
      filtroNombre(){
        let self = this;
        this.filtro = 'Filtrando por: ' + this.filtro_nombre;
        this.filtrando_por = "nombre";
        axiosInst.get("/reservas/nombre/"+this.filtro_nombre).then(
          response => {
            if(response.status === 200){
              self.reservas = response.data;
              this.parseReservas(response.data);
              this.scheduler.update({ events : self.events});
            }
          }).catch( error => {
          console.log(JSON.stringify(error));
        });
      },
      editTipo( tipo ){
        alert("Aún no implementado")
        /*axiosInst.post("/tipo/editar", tipo).then(
          response => {
            if(response.status === 200){
              alert("Editado con éxito");
              this.loadPrecios();
            }
          }
        ).catch( error => {
          console.log(JSON.stringif(error);
        });*/
      },
      newTipo( tipo ){
        axiosInst.post("/tipo/"+tipo.tipo+"/"+tipo.precio).then(
          response => {
            if(response.status === 200){
              alert("Agregado con éxito");
              this.loadPrecios();
            }
          }
        ).catch( error => {
          console.log(JSON.stringify(error));
        });
      },
      deleteTipo( index ){
        console.log("borrando " +index);
        axiosInst.post("/tipo/"+index).then(
          response => {
            if(response.status === 200){
              alert("Eliminado con éxito");
              this.loadPrecios();
            }
          }
        ).catch( error => {
          console.log(JSON.stringify(error));
        });
      },
      cancelarReserva(index){
        axiosInst.post("/reserva/delete/"+index).then(
          response => {
            if(response.status === 200){
              alert("Eliminado con éxito");
              this.loadEvents();
            }
          }
        ).catch( error => {
          console.log(JSON.stringify(error));
        });
      },
      showModal() {
        this.insertModalVisible = true;
      },
      closeModal() {
        this.selectedRange = [];
        //this.habitaciones = [];
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
        alert("Número de dias seleccionados: " + days);
        this.config.days = days + 1;
        this.config.startDate = inicio;
        /*let todos = this.events;
        this.events = [];
        for (event in todos) {
          if (event.start < fin && event.end > inicio) {
            this.events.push(event);
          }
        }*/
        this.loadEvents();
        //this.scheduler.update()
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
        axiosInst.get('habitaciones').then(
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
          console.log(JSON.stringify(error))
        });
      },
      parseRooms( habitaciones ) {
        let resources = [];
        //let pisos = [];
        for(let i = 0; i < habitaciones.length; i++){
          let resource = {
            id: habitaciones[i].id,
            name: " - " + habitaciones[i].number,
            valor: habitaciones[i].tipo.valor,
            columns: [{
              html: habitaciones[i].tipo.tipo,
            }]
          };
          resources.push(resource);
        }
        this.resources = resources;
      },
      parseReservas( data ) {
        let events = [];
        //let pisos = [];
        for(let i = 0; i < data.length; i++){
          let event = {
            id: data[i].id,
            codigo: data[i].codigo,
            text: data[i].nombre,
            start: data[i].inicio.split(" ")[0],
            end: data[i].fin.split(" ")[0],
            resource: data[i].habitacion.id,
            tipo_Reserva: data[i].tipo_Reserva,
            fecha: data[i].fecha_reserva.split(" ")[0],
            status: "Check In",
            total: data[i].valor,
          };
          events.push(event);
        }
        this.events = events;
      },
      async loadEvents(){
        var self = this;
        this.loading = true;
        await axiosInst.get('reservas').then(
          response => {
            if(response.status === 200){
              self.reservas = response.data;
              this.parseReservas(response.data);
              this.scheduler.update({ events : self.events});
            }
            else{
              console.log("ERROR STATUS != 200");
            }
          }).catch(error => {
          console.log("Ha ocurrido un error en loadEvents");
          console.log(JSON.stringify(error))
        });
        this.loading = false;
      },
      loadPrecios(){
        var self = this;
        this.loading = true;
        axiosInst.get('tipos').then(
          response => {
            if(response.status === 200){
              self.precios = response.data;
            }
            else{
              console.log("ERROR STATUS != 200");
            }
          }).catch(error => {
          console.log("Ha ocurrido un error en loadPrecios");
          console.log(error)
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

  #help {
    padding: 10px;
  }

  #help li{
    text-align: left;
  }
</style>
