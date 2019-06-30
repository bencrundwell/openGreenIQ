<template>
  <div class="animated fadeIn">
    <b-card header-tag="header" footer-tag="footer">
      <div slot="header">
        <h4 class="card-title mb-0">Watering Schedule</h4>
      </div>
      <!-- <b-table striped hover :items="schedule"></b-table> -->

      <table class="table b-table table-striped table-hover">
        <thead>
          <tr>
            <th>Zones</th>
            <th>Days</th>
            <th class="text-center">Time</th>
            <th>Test</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in schedule" :key="item.id">
            <td>
              <span v-if="item.zone_1">
                <span class="badge badge-info">{{zones[0].name}}</span>&nbsp;
              </span>
              <span v-if="item.zone_2">
                <span class="badge badge-info">{{zones[1].name}}</span>&nbsp;
              </span>
              <span v-if="item.zone_3">
                <span class="badge badge-info">{{zones[2].name}}</span>&nbsp;
              </span>
              <span v-if="item.zone_4">
                <span class="badge badge-info">{{zones[3].name}}</span>&nbsp;
              </span>
              <span v-if="item.zone_5">
                <span class="badge badge-info">{{zones[4].name}}</span>&nbsp;
              </span>
              <span v-if="item.zone_6">
                <span class="badge badge-info">{{zones[5].name}}</span>&nbsp;
              </span>
            </td>
            <td>
              <span v-if="item.day_mon">M</span>
              <span v-if="item.day_tue">Tu</span>
              <span v-if="item.day_wed">W</span>
              <span v-if="item.day_thu">Th</span>
              <span v-if="item.day_fri">F</span>
              <span v-if="item.day_sat">Sa</span>
              <span v-if="item.day_sun">Su</span>
            </td>
            <td
              class="text-center"
            >{{ Math.floor(item.start_time/60) }}:{{ (item.start_time%60).toString().padStart(2, '0') }}</td>
            <!-- <td class="text-center">{{ item.duration/60 }}:{{ (item.duration%60).toString().padStart(2, '0') }}</td> -->
            <td>
                <button class="btn btn-primary" type="button" v-on:click="trigger(item.id)">
                  <i class="fa fa-play-circle-o"></i>&nbsp;Trigger
                </button>
            </td>
          </tr>
        </tbody>
      </table>
    </b-card>
  </div>
</template>
 
<script>
import { mapState } from "vuex";

export default {
  name: "schedule",
  mounted() {
    this.$store.dispatch("getSchedule");
    this.$store.dispatch("getZones");
  },
  computed: {
    schedule() {
      var schedule = this.$store.state.schedule;
      schedule.map(item => {
        const old_days = item.days;
        item.days_decode = [];
        item.days_decode.mon = old_days & 64;
        item.days_decode.tue = old_days & 32;
        item.days_decode.wed = old_days & 16;
        item.days_decode.thu = old_days & 8;
        item.days_decode.fri = old_days & 4;
        item.days_decode.sat = old_days & 2;
        item.days_decode.sun = old_days & 1;
      });
      return schedule;
    },
    zones() {
      var zones = this.$store.state.zones;
      return zones;
    }
  },

  methods: {
    trigger: function(id) {
      console.log("emit postScheduleTest, id: " + id)
      var json = {"id": Number(id)}
      this.$store.dispatch("postScheduleTest", json)
    }
  }
};
</script>