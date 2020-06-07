<template>
  <div class="animated fadeIn">
    <b-card id="watering-schedule" header-tag="header" footer-tag="footer">
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in schedule" :key="item.id">
            <td>
              <div v-if="item.zone_1 && zones[0]">
                <span class="badge badge-info">{{zones[0].name}}</span>
              </div>
              <div v-if="item.zone_2 && zones[0]">
                <span class="badge badge-info">{{zones[1].name}}</span>
              </div>
              <div v-if="item.zone_3 && zones[0]">
                <span class="badge badge-info">{{zones[2].name}}</span>
              </div>
              <div v-if="item.zone_4 && zones[0]">
                <span class="badge badge-info">{{zones[3].name}}</span>
              </div>
              <div v-if="item.zone_5 && zones[0]">
                <span class="badge badge-info">{{zones[4].name}}</span>
              </div>
              <div v-if="item.zone_6 && zones[0]">
                <span class="badge badge-info">{{zones[5].name}}</span>
              </div>
              
            </td>
            <td>
              <div v-if="item.day_mon"><span class="badge badge-secondary">Monday</span></div>
              <div v-if="item.day_tue"><span class="badge badge-secondary">Tuesday</span></div>
              <div v-if="item.day_wed"><span class="badge badge-secondary">Wednesday</span></div>
              <div v-if="item.day_thu"><span class="badge badge-secondary">Thursday</span></div>
              <div v-if="item.day_fri"><span class="badge badge-secondary">Friday</span></div>
              <div v-if="item.day_sat"><span class="badge badge-secondary">Saturday</span></div>
              <div v-if="item.day_sun"><span class="badge badge-secondary">Sunday</span></div>
            </td>
            <td
              class="text-center"
            >{{ Math.floor(item.start_time/60) }}:{{ (item.start_time%60).toString().padStart(2, '0') }}</td>
            <!-- <td class="text-center">{{ item.duration/60 }}:{{ (item.duration%60).toString().padStart(2, '0') }}</td> -->
            <td>
              <b-button
                variant="primary"
                v-on:click="trigger(item.id)"
              >
                <i class="fa fa-play-circle-o"></i>&nbsp;Trigger
              </b-button>&nbsp;
              <b-button
                variant="primary"
              >
                <i class="fa fa-pencil-square-o"></i>&nbsp;Edit
              </b-button>
              <a v-bind:href="'#/schedules/'+item.id">Edit</a>
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