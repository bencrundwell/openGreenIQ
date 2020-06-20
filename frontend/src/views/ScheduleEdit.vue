<template>
  <div class="animated fadeIn">
    <b-card header-tag="header" footer-tag="footer">
      <b-form @submit="onSubmit">
        <div slot="header">
          <h4 class="card-title mb-0">Edit Watering Schedule</h4>
        </div>
        <b-form-group
          id="input-group-1"
          label="Active Zones:"
          description="Zones to include in this schedule"
          v-if="schedule"
        >
        
          <template v-for="zone in zones">
            <b-form-checkbox v-if="zone.pin == 1" :key="zone.pin" v-model="schedule.zone_1" switch>
              {{zone.name}}
            </b-form-checkbox>
            <b-form-checkbox v-if="zone.pin == 2" :key="zone.pin" v-model="schedule.zone_2" switch>
              {{zone.name}}
            </b-form-checkbox>
            <b-form-checkbox v-if="zone.pin == 3" :key="zone.pin" v-model="schedule.zone_3" switch>
              {{zone.name}}
            </b-form-checkbox>
            <b-form-checkbox v-if="zone.pin == 4" :key="zone.pin" v-model="schedule.zone_4" switch>
              {{zone.name}}
            </b-form-checkbox>
            <b-form-checkbox v-if="zone.pin == 5" :key="zone.pin" v-model="schedule.zone_5" switch>
              {{zone.name}}
            </b-form-checkbox>
            <b-form-checkbox v-if="zone.pin == 6" :key="zone.pin" v-model="schedule.zone_6" switch>
              {{zone.name}}
            </b-form-checkbox>
          </template>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Active Days:"
          description="Which days to water on"
          v-if="schedule"
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
          v-if="schedule"
        >
          <b-form-timepicker v-model="time" value="item" locale="en"></b-form-timepicker>
        </b-form-group>
        
        <b-button v-on:click="onCancel()">
          <i class="fa fa-window-close-o"></i>&nbsp;Cancel
        </b-button>
        &nbsp;
        <b-button
          variant="danger"
          v-on:click="deleteSchedule(schedule.id)"
        >
          <i class="fa fa-trash-o"></i>&nbsp;Delete
        </b-button>
        &nbsp;
        <b-button variant="primary" type="submit">
          <i class="fa fa-pencil-square-o"></i>&nbsp;Update
        </b-button>
      </b-form>
    </b-card>
    
  </div>
</template>
 
<script>
import { mapState } from "vuex";

export default {
  name: "scheduleEdit",
  mounted() {
    console.log("mounted()");
    this.$store.dispatch("getSchedule");
    this.$store.dispatch("getZones");
  },
  computed: {
    schedule() {
      console.log("id = " + this.$route.params.id);
      return this.$store.state.schedule.find(s => s.id == this.$route.params.id);
    },
    zones() {
      return this.$store.state.zones;
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
        // console.log("set time: " + hours + " " + minutes + " " + time);
      }
    }
  },

  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.dispatch('updateSchedule', this.schedule);
      window.location = "#/schedules/";
    },
    onCancel() {
      console.log("Cancel!");
      window.location = "#/schedules/";
    },
    deleteSchedule: function(id) {
      console.log("emit deleteSchedule, id: " + id);
      var json = { id: Number(id) };
      this.$store.dispatch("deleteSchedule", json);
      window.location = "#/schedules/";
    },

  }
};
</script>