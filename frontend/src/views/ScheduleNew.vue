<template>
  <div class="animated fadeIn">
    <b-card header-tag="header" footer-tag="footer">
      <b-form @submit="onSubmit">
        <div slot="header">
          <h4 class="card-title mb-0">Add Watering Schedule</h4>
        </div>
        <b-form-group
          id="input-group-1"
          label="Active Zones:"
          description="Zones to include in this schedule"
        >
          <b-form-checkbox v-if="zones[0]" v-model="schedule.zone_1" switch>
            {{zones[0].name}}
          </b-form-checkbox>
          <b-form-checkbox v-if="zones[1]" v-model="schedule.zone_2" switch>
            {{zones[1].name}}
          </b-form-checkbox>
          <b-form-checkbox v-if="zones[2]" v-model="schedule.zone_3" switch>
            {{zones[2].name}}
          </b-form-checkbox>
          <b-form-checkbox v-if="zones[3]" v-model="schedule.zone_4" switch>
            {{zones[3].name}}
          </b-form-checkbox>
          <b-form-checkbox v-if="zones[4]" v-model="schedule.zone_5" switch>
            {{zones[4].name}}
          </b-form-checkbox>
          <b-form-checkbox v-if="zones[5]" v-model="schedule.zone_6" switch>
            {{zones[5].name}}
          </b-form-checkbox>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Active Days:"
          description="Which days to water on"
        >
          <b-form-checkbox v-model="schedule.day_mon" switch>Monday</b-form-checkbox>
          <b-form-checkbox v-model="schedule.day_tue" switch>Tuesday</b-form-checkbox>
          <b-form-checkbox v-model="schedule.day_wed" switch>Wednesday</b-form-checkbox>
          <b-form-checkbox v-model="schedule.day_thu" switch>Thursday</b-form-checkbox>
          <b-form-checkbox v-model="schedule.day_fri" switch>Friday</b-form-checkbox>
          <b-form-checkbox v-model="schedule.day_sat" switch>Saturday</b-form-checkbox>
          <b-form-checkbox v-model="schedule.day_sun" switch>Sunday</b-form-checkbox>
        </b-form-group>
        <b-form-group
          id="input-group-3"
          label="Start Time:"
          description="When to start watering"
        >
          <b-form-timepicker v-model="time" value="item" locale="en"></b-form-timepicker>
        </b-form-group>
        
        <b-button v-on:click="onCancel()">
          <i class="fa fa-window-close-o"></i>&nbsp;Cancel
        </b-button>
        &nbsp;
        <b-button variant="primary" type="submit">
          <i class="fa fa-pencil-square-o"></i>&nbsp;Create
        </b-button>
      </b-form>
    </b-card>
    
  </div>
</template>
 
<script>
import { mapState } from "vuex";

export default {
  name: "scheduleNew",
  mounted() {
    console.log("mounted()");
    this.$store.dispatch("getZones");
  },
  computed: {
    schedule() {
      var schedule = {};
      schedule.start_time = 0;
      return schedule;
    },
    zones() {
      var zones = this.$store.state.zones;
      return zones;
    },
    time: {
      get () {
        var hours = Math.floor(this.schedule.start_time / 60);  
        var minutes = this.schedule.start_time % 60;
        if (minutes < 10) minutes = '0' + minutes;
        return hours + ":" + minutes + ":00";
      },
      set (value) {
        var hours = parseInt(value.split(':')[0]);
        var minutes = parseInt(value.split(':')[1]);
        var time = ((hours * 60) + minutes);
        this.schedule.start_time = time;
      }
    }
  },

  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      console.log("Add Schedule:");
      console.log(this.schedule);
      this.$store.dispatch('addSchedule', this.schedule);
      window.location = "#/schedules/";
    },
    onCancel() {
      console.log("Cancel!");
      window.location = "#/schedules/";
    }

  }
};
</script>