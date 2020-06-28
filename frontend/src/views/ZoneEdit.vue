<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <b-card header-tag="header" footer-tag="footer" v-if="zone">
          <b-form @submit="onSubmit">
            <div slot="header">
              <h4 class="card-title mb-0">Edit Zone</h4>
            </div>
            <b-input-group prepend="Zone Output" append="" class="mt-3">
              <b-form-input type="number" min="1" max="6" step="1" v-model="zone.pin"></b-form-input>
            </b-input-group>
            <b-input-group prepend="Name" append="" class="mt-3">
              <b-form-input v-model="zone.name"></b-form-input>
            </b-input-group>
            <b-input-group prepend="Average Flow" append="L/m" class="mt-3">
              <b-form-input type="number" min="0" step="0.001" v-model="zone.avg_flow"></b-form-input>
            </b-input-group>
            <b-input-group prepend="Area" append="m²" class="my-3">
              <b-form-input v-model="zone.area"></b-form-input>
            </b-input-group>
            <b-input-group prepend="Vegitation" class="my-3">
              <b-form-select
                v-model="zone.vegitation"
                :options="vegitationTypes"
              ></b-form-select>
            </b-input-group>

            <b-input-group prepend="Adjust" append="%" class="my-3">
              <b-form-input v-model="zone.adjust"></b-form-input>
            </b-input-group>
            
            <b-button v-on:click="onCancel()">
              <i class="fa fa-window-close-o"></i>&nbsp;Cancel
            </b-button>
            &nbsp;
            <b-button
              variant="danger"
              v-on:click="deleteSchedule(zone.pin)"
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
    </div>
  </div>
</template>
 
<script>
import { mapState } from "vuex";

export default {
  name: "ZoneEdit",
  data() {
    return {
      vegitationTypes: [
        { value: '0', text: 'Long' },
        { value: '1', text: 'Short' }
      ]
    }
  },
  mounted() {
    console.log("mounted()");
    this.$store.dispatch("getSchedule");
    this.$store.dispatch("getZones");
  },
  computed: {
    zone() {
      return this.$store.state.zones.find(z => z.pin == this.$route.params.pin);
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
      this.$store.dispatch('updateZone', this.zone);
      let pin = this.$route.params.pin;
      window.location = "#/zones/" + pin;
    },
    onCancel() {
      console.log("Cancel!");
      let pin = this.$route.params.pin;
      window.location = "#/zones/" + pin;
    },
    deleteSchedule: function(pin) {
      console.log("emit deleteZone, pin: " + pin);
      var json = { pin: Number(pin) };
      this.$store.dispatch("deleteZone", json);
      window.location = "#/zones/";
    },

  }
};
</script>