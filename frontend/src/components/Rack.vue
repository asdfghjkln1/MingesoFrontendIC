<template>
  <div id="Scheduler">
    <div class="scheduler-container">
      <div id="fechas" class="date-container">
        <input type="date" id="inicio" v-on:change="DateChange">
        <input type="date" id="fin" v-on:change="DateChange">
      </div>
      <DayPilotScheduler id="dp" :config="config" ref="scheduler" />
    </div>
    <ModalReserva v-on:confirm="nuevaReserva" v-bind:start="sel_start" v-bind:end="sel_end" v-bind:resource="sel_resource" v-bind:total="sel_total" v-show="insertModalVisible" @close="closeModal"/>
  </div>
</template>

<script>
  import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue'
  import ModalReserva from './ModalReserva'
  import axios from 'axios';

  const url = "http://127.0.0.1:3000/"; //'http://159.65.3.243:8090/';
  const axiosInst = axios.create({
    baseURL: url,
    timeout: 10000
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
        sel_start: '',
        sel_end: '',
        sel_resource: '',
        sel_total: '',
        resources : [],
        events: [],
        //
        dp: {},
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
          onTimeRangeSelected: function (args) {
            //this.dp = this; //BORRAR, PARA PRUEBAS
            //Cargar datos al modal
            this.sel_start= args.start.value;
            this.sel_end= args.end.value;
            this.sel_resource= args.resource;
            this.sel_total = 13000; //Hacer consulta backend previamente para cargar los precios...
            //Abrir modal
            this.showModal();
            /*DayPilot.Modal.prompt("<strong>Realizar una reserva</strong>", "Event 1").then(function(modal) {
              dp.clearSelection();
              if (!modal.result) { return; }
              dp.events.add(new DayPilot.Event({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                resource: args.resource,
                text: modal.result
              }));
            });*/
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
          eventClickHandling: "Edit",
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
              "<div>Fecha realizado: " + args.data.fecha.split("T")[0] +"</div>" +
              "<div>Valor: " + args.data.total + "</div>" +
              "<br>" +
              "<router-link :to=\"{ name: 'reservas', params: { codigo_reserva: '" + args.data.codigo + "'}}\"> Ir a reserva </router-link>";
          },
          rowHeaderColumns : [{
            title: 'Habitación',
            width: 150
          }, {
            title: 'Tamaño',
            width: 50
          }, {
            title: 'Estado',
            width: 60
          }]
          /*rowHeaderColumns: [
            { title: 'Habitación', width: '60'},
            { title: 'Tipo', width: '50'},
            { title: 'Estado', width : '70'}
          ],*/
        },
      }
    },
    components: {
      DayPilotScheduler,
      ModalReserva
    },
    computed: {
      // DayPilot.Scheduler object - https://api.daypilot.org/daypilot-scheduler-class/
      scheduler: function () {
        return this.$refs.scheduler.control;
      }
    },
    methods: {
      nuevaReserva( reserva ){
        reserva.id = DayPilot.guid();
        //this.dp.events.add(new DayPilot.Event( reserva )); //ARREGLAR
        //this.scheduler.update();
        console.log( reserva );
        alert('Reserva creada con éxito (Aun no la guarda)');
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
        axiosInst.get(url + 'resources').then(
          response => {
            if(response.status === 200){
              self.resources = response.data;
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
      loadEvents(){
        var self = this;
        axiosInst.get(url + 'events').then(
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
      }
    },
    mounted: function() {
      this.loadResources();
      this.loadEvents();
      this.loadInitialRange();
    }
  }
</script>

<style scoped>
  .scheduler-container{
    padding: 30px 10px 30px 10px;
    margin-top: 20px;
    align-content: center;
  }
</style>
