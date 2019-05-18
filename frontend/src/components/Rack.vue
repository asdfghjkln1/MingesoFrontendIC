<template>
  <DayPilotScheduler id="dp" :config="config" ref="scheduler" />
</template>

<script>
  import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue'
  import Vue from 'vue'

  export default {
    name: 'Scheduler',
    data: function() {
      return {
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
      loadEvents() {
        const events = [
          // { id: 1, start: "2018-10-01T00:00:00", end: "2018-10-05T00:00:00", text: "Event 1", resource: "R1" },
          { id: 2, start: DayPilot.Date.today().addDays(2), end: DayPilot.Date.today().addDays(5), text: "Event 1", resource: "R2"}
        ];
        Vue.set(this.config, "events", events);
      },
      loadResources() {
        const resources = [
          {name: "Resource 1", id: "R1"},
          {name: "Resource 2", id: "R2"},
          {name: "Resource 3", id: "R3"}
        ];
        Vue.set(this.config, "resources", resources);
      }
    },
    mounted: function() {
      this.loadResources();
      this.loadEvents();

      this.scheduler.message("Welcome!");
    }
  }
</script>
