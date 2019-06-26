<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-6 col-lg-4">
        <div class="card">
          <div class="card-header">Information</div>
          <div class="card-body">
            <table v-if="zone" class="table table-striped">
              <tbody>
                <tr>
                  <td>GPIO Pin</td>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-lg-4">
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
  </div>
</template>
 
<script>
import { mapState } from "vuex";

export default {
  name: "zone",
  mounted() {
    this.$store.dispatch("getZones");
  },

  computed: {
    zone() {
      return this.$store.state.zones[this.$route.params.id-1];
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
      var json = {"zone": this.$route.params.id ,"duration": this.time*60}
      console.log(`Water ${this.$store.state.zones[this.$route.params.id-1].name} for ${this.time} mins`);
      console.log("send " + JSON.stringify(json));

      this.$store.dispatch("postWater", json);

    }
  }
};
</script>