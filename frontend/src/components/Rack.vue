<template>
  <div id="Scheduler">
    <div class="scheduler-container">
      <div id="fechas" class="date-container">
        <input type="date" id="inicio" v-on:change="DateChange">
        <input type="date" id="fin" v-on:change="DateChange">
      </div>
      <DayPilotScheduler id="dp" :config="config" ref="scheduler" />
    </div>
    <div><h2>Test model</h2>
      <h4>Eventos: </h4>
      <ul v-for="event in events">
        <li>{{ event }}</li>
      </ul>
      <h4>Pisos: </h4>
      <div> {{ resources }}</div>
    </div>
  </div>
</template>

<script>
  import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue'
  import Vue from 'vue'
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
        resources : [],
        events: [],
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
            var dp = this;
            DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function(modal) {
              dp.clearSelection();
              if (!modal.result) { return; }
              dp.events.add(new DayPilot.Event({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                resource: args.resource,
                text: modal.result
              }));
            });
          },
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
          bubble: new DayPilot.Bubble({
            onLoad: function(args) {
              // if event object doesn't specify "bubbleHtml" property
              // this onLoad handler will be called to provide the bubble HTML
              args.html = "Event details";
            }
          }),
          contextMenu: new DayPilot.Menu({
            items: [
              { text: "Delete", onClick: function(args) { var dp = args.source.calendar; dp.events.remove(args.source); } }
            ]
          }),
          treeEnabled: true,
          rowHeaderWidth: 120,
          rowHeaderWidthAutoFit: false,
          rowMinHeight: 50,
          onBeforeEventRender: function(args) {
            if(args.data.tipo === "Empresa"){
              args.data.barColor = "red"
            }else if(args.data.tipo === "Particular"){
              args.data.barColor = "blue"
            }
          },
          /*rowHeaderColumns: [
            { title: 'Habitación', width: '60'},
            { title: 'Tipo', width: '50'},
            { title: 'Estado', width : '70'}
          ],*/
        },
      }
    },
    components: {
      DayPilotScheduler
    },
    computed: {
      // DayPilot.Scheduler object - https://api.daypilot.org/daypilot-scheduler-class/
      scheduler: function () {
        return this.$refs.scheduler.control;
      }
    },
    methods: {
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
        /*const resources = [
          { name: "Piso 1", id: "F1", expanded: true, childen : [
            { name: "101", id: "101"},
            {name: "102", id: "102"},
            {name: "103", id: "103"},
            {name: "104", id: "104"},
            {name: "105", id: "105"} ]
          },
          { name: "Piso 2", id: "F2", expanded: true, childen : [
            {name: "201", id: "201"},
            {name: "202", id: "202"},
            {name: "203", id: "203"},
            {name: "204", id: "204"}]
          },
          { name: "Piso 3", id: "F3", expanded: false, childen : [
            {name: "301", id: "301"},
            {name: "302", id: "302"},
            {name: "303", id: "303"}]
          }
        ];*/
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
