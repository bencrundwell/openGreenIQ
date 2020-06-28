<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="card">
          <div class="card-header">Information</div>
          <div class="card-body" v-if="zone">
            <table class="table table-striped">
              <tbody>
                <tr>
                  <td>Zone Output</td>
                  <td>{{zone.pin}}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{{zone.name}}</td>
                </tr>
                <tr>
                  <td>Average Flow</td>
                  <td>{{zone.avg_flow}}</td>
                </tr>
                <tr>
                  <td>Area</td>
                  <td>{{zone.area}} m&sup2;</td>
                </tr>
                <tr>
                  <td>Vegitation</td>
                  <td>{{zone.vegitation == 1 ? "Short" : "Long"}}</td>
                </tr>
                <tr>
                  <td>Adjust</td>
                  <td>{{zone.adjust}}%</td>
                </tr>
              </tbody>
            </table>
            <div class="float-right mb-0">
              <b-button
                v-bind:href="'#/zones/'+zone.pin+'/edit'"
                variant="primary"
              >
                <i class="fa fa-pencil-square-o"></i>&nbsp;Edit
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="card">
          <div class="card-header">Manual Override</div>
          <div class="card-body">
            <form class="form-horizontal" v-on:submit="manual" action method="post" _lpchecked="1">
              <div class="form-group row">
                <div class="col-md-12">
                  <div class="input-group">
                    <input
                      class="form-control"
                      id="time"
                      type="number"
                      name="time"
                      placeholder="Watering Time"
                      autocomplete="off"
                      v-model="time"
                      min="0"
                      max="60"
                      step="0.1"
                    >
                    <div class="input-group-append">
                      <span class="input-group-text">mins</span>
                    </div>
                    <span class="input-group-append">
                      <button class="btn btn-primary" type="submit">Water Now</button>
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <b-card header-tag="header" footer-tag="footer">
      <div slot="header">
        <h4 class="card-title mb-0">Event History</h4>
      </div>
      <!-- <b-table striped hover :items="events"></b-table> -->

      <table class="table b-table table-striped table-hover">
        <thead>
          <tr>
            <th>Time</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in events" :key="item.id">
            <td>
              {{ formatDate(item.timestamp) }}
            </td>
            <td>
              {{item.event}}
            </td>
          </tr>
        </tbody>
      </table>
    </b-card>
  </div>
</template>
 
<script>
import { mapState } from "vuex";
var moment = require('moment');

export default {
  name: "zone",
  mounted() {
    this.$store.dispatch("getZones");
    this.$store.dispatch("getEvents");
  },

  computed: {
    zone() {
      return this.$store.state.zones.find(z => z.pin == this.$route.params.pin);
    },
    events() {
      return this.$store.state.events.filter(e => (e.zone == this.$route.params.pin) && (e.type == 1));
    }
  },

  data: function() {
    return {
      time: null
    }
  },

  methods: {
    manual: function(event) {
      event.preventDefault();
      var json = {"zone": Number(this.$route.params.pin) ,"duration": this.time*60}
      console.log(`Water ${this.$store.state.zones.find(z => z.pin == this.$route.params.pin)} for ${this.time} mins`);
      console.log("send " + JSON.stringify(json));

      this.$store.dispatch("postWater", json);

      return(true);

    },
    formatDate(date) {
      return moment(date).format("ddd Do @ hh:mm")
    }
  }
};
</script>