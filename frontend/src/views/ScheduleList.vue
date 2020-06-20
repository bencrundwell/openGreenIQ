<template>
  <div class="animated fadeIn">
    <b-card id="watering-schedule" header-tag="header" footer-tag="footer">
      <div slot="header">
        <h4 class="card-title mb-0">Watering Schedule</h4>
      </div>
      <div class="float-right mb-2">
        <b-button
          v-bind:href="'#/schedules/add'"
          variant="primary"
        >
          <i class="fa fa-plus-circle"></i>&nbsp;New Schedule
        </b-button>
      </div>

      <table class="table b-table table-striped table-hover">
        <thead>
          <tr>
            <th>Zones</th>
            <th>Days</th>
            <th class="text-center">Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in schedule" :key="item.id">
            <td>
              <template v-for="zone in zones">
                <div v-if="item.zone_1 && zone.pin == 1" :key="zone.pin">
                  <span class="badge badge-info">{{zone.name}}</span>
                </div>
                <div v-if="item.zone_2 && zone.pin == 2" :key="zone.pin">
                  <span class="badge badge-info">{{zone.name}}</span>
                </div>
                <div v-if="item.zone_3 && zone.pin == 3" :key="zone.pin">
                  <span class="badge badge-info">{{zone.name}}</span>
                </div>
                <div v-if="item.zone_4 && zone.pin == 4" :key="zone.pin">
                  <span class="badge badge-info">{{zone.name}}</span>
                </div>
                <div v-if="item.zone_5 && zone.pin == 5" :key="zone.pin">
                  <span class="badge badge-info">{{zone.name}}</span>
                </div>
                <div v-if="item.zone_6 && zone.pin == 6" :key="zone.pin">
                  <span class="badge badge-info">{{zone.name}}</span>
                </div>
              </template>
              
            </td>
            <td class="d-none d-sm-block">
              <div v-if="item.day_mon"><span class="badge badge-secondary">Monday</span></div>
              <div v-if="item.day_tue"><span class="badge badge-secondary">Tuesday</span></div>
              <div v-if="item.day_wed"><span class="badge badge-secondary">Wednesday</span></div>
              <div v-if="item.day_thu"><span class="badge badge-secondary">Thursday</span></div>
              <div v-if="item.day_fri"><span class="badge badge-secondary">Friday</span></div>
              <div v-if="item.day_sat"><span class="badge badge-secondary">Saturday</span></div>
              <div v-if="item.day_sun"><span class="badge badge-secondary">Sunday</span></div>
            </td>
            <td class="d-sm-none">
              <div v-if="item.day_mon"><span class="badge badge-secondary">Mon</span></div>
              <div v-if="item.day_tue"><span class="badge badge-secondary">Tue</span></div>
              <div v-if="item.day_wed"><span class="badge badge-secondary">Wed</span></div>
              <div v-if="item.day_thu"><span class="badge badge-secondary">Thu</span></div>
              <div v-if="item.day_fri"><span class="badge badge-secondary">Fri</span></div>
              <div v-if="item.day_sat"><span class="badge badge-secondary">Sat</span></div>
              <div v-if="item.day_sun"><span class="badge badge-secondary">Sun</span></div>
            </td>
            <td
              class="text-center"
            >{{ Math.floor(item.start_time/60) }}:{{ (item.start_time%60).toString().padStart(2, '0') }}</td>
            <!-- <td class="text-center">{{ item.duration/60 }}:{{ (item.duration%60).toString().padStart(2, '0') }}</td> -->
            <td>
              <!-- <b-button
                variant="danger"
                v-on:click="trigger(item.id)"
              >
                <i class="fa fa-play-circle-o"></i>&nbsp;Trigger
              </b-button>&nbsp; -->
              <b-button
                v-bind:href="'#/schedules/'+item.id"
                variant="primary"
              >
                <i class="fa fa-pencil-square-o"></i>&nbsp;Edit
              </b-button>
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
  name: "scheduleList",
  mounted() {
    console.log("mounted()");
    this.$store.dispatch("getSchedule");
    this.$store.dispatch("getZones");
  },
  computed: {
    schedule() {
      var schedule = this.$store.state.schedule;
      return schedule;
    },
    zones() {
      var zones = this.$store.state.zones;
      return zones;
    }
  },

  methods: {
    trigger: function(id) {
      console.log("emit postScheduleTest, id: " + id);
      var json = { id: Number(id) };
      this.$store.dispatch("postScheduleTest", json);
    },
    setTime: function(item) {
      let temp = this.time.split(':', 2);
      item.start_time = (parseInt(temp[0])*60) + parseInt(temp[1]);
    }
  }
};
</script>