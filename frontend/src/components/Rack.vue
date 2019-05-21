<template>
  <div id="Scheduler">
    <div class="scheduler-container">
      <div id="fechas" class="date-container">
        <input type="date" id="inicio" v-on:change="StartDateChange" value="">
        <input type="date" id="fin" v-on:change="StartDateChange">
      </div>
      <DayPilotScheduler id="dp" :config="config" ref="scheduler" />
    </div>
  </div>
</template>

<script>
  import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue'
  import Vue from 'vue'
  import axios from 'axios';

  const url = 'http://159.65.3.243:8090/';
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
        events: [
            // { id: 1, start: "2018-10-01T00:00:00", end: "2018-10-05T00:00:00", text: "Event 1", resource: "R1" },
            { id: 1, start: DayPilot.Date.today().addDays(2), end: DayPilot.Date.today().addDays(5), text: "Pepe", resource: "101"},
            { id: 2, start: "2019-05-22T00:00:00", end: "2019-05-29T00:00:00", text: "Pepito", resource: "101"},
            { id: 3, start: "2019-04-19T00:00:00", end: "2019-04-23T00:00:00", text: "Juanito", resource: "201"},
            { id: 4, start: "2019-06-02T00:00:00", end: "2019-06-03T00:00:00", text: "Pedrito", resource: "302"},
            { id: 5, start: "2019-05-25T00:00:00", end: "2019-05-26T00:00:00", text: "Jorgito", resource: "101"}
          ],
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
        },
      }
    },
    props: {
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
      StartDateChange() {
        let inicio = document.getElementById("inicio").value;
        let fin = document.getElementById("fin").value;
        if (inicio > fin) {
          alert("Seleccione una fecha válida");
          return;
        }
        this.config.events = [];
        const timeDiff = Math.abs(Date.parse(inicio) - Date.parse(fin));
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        alert("Dias: " + days);
        this.config.days = days + 1;
        this.config.startDate = inicio;
        const selected_events = [];
        for (event in this.events) {
          if (event > inicio && event < fin) {
            selected_events.push(event);
          }
        }
        Vue.set(this.config, "events", selected_events)
      },
      loadEvents() {
        Vue.set(this.config, "events", this.events);
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

        const resources = [
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
        ];
        Vue.set(this.config, "resources", resources);
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
