<template>
  <div class="animated fadeIn">

    <b-card v-if="events" header-tag="header" footer-tag="footer">
      <div slot="header">
        <h4 class="card-title mb-0">System Status</h4>
      </div>
      <b-card-text>
        <!-- <p>Status: {{status}}</p> -->
        <p>Valve Status: 
          <span v-if="status.master==1" class="badge badge-success">On</span><span v-if="status.master==0" class="badge badge-secondary">Off</span>&nbsp;
          <span v-if="status.v1==1" class="badge badge-success">Valve 1 </span>
          <span v-if="status.v2==1" class="badge badge-success">Valve 2 </span>
          <span v-if="status.v3==1" class="badge badge-success">Valve 3 </span>
          <span v-if="status.v4==1" class="badge badge-success">Valve 4 </span>
          <span v-if="status.v5==1" class="badge badge-success">Valve 5 </span>
          <span v-if="status.v6==1" class="badge badge-success">Valve 6 </span>
        </p>
        <p v-if="status && status.flow_rate_avg != undefined">Flow Rate: {{status.flow_rate_avg.toFixed(2)}} lpm</p>
        <p v-if="status && status.irrisat && status.irrisat.Daily">Weather Today: {{status.irrisat.Daily[0].Description}}</p>
        <p v-if="status && status.irrisat">Weather Next Week: {{status.irrisat.NextWeek}}</p>
      </b-card-text>
    </b-card> 
    
    <b-card>
      <b-row>
        <b-col sm="5">
          <h4 id="traffic" class="card-title mb-0">Weather Data</h4>
          <!-- <div class="small text-muted">November 2017</div> -->
        </b-col>
        <b-col sm="7" class="d-none d-md-block">
          <b-button-toolbar class="float-right" aria-label="Toolbar with buttons group">
            <b-form-radio-group class="mr-3" id="radiosBtn" buttons button-variant="outline-secondary" v-model="selected" name="radiosBtn">
              <b-form-radio class="mx-0" value="Day">Day</b-form-radio>
              <b-form-radio class="mx-0" value="Month">Month</b-form-radio>
              <b-form-radio class="mx-0" value="Year">Year</b-form-radio>
            </b-form-radio-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <main-chart-example chartId="main-chart" class="chart-wrapper" style="height:300px;margin-top:40px;" height="300"></main-chart-example>
    </b-card>

    <b-card v-if="events" id="watering-history" header-tag="header" footer-tag="footer">
      <div slot="header">
        <h4 class="card-title mb-0">Watering History</h4>
      </div>
      <p>Volume delivered in the past 7 days...</p>
      <table class="table b-table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>{{events.day[6].name}}</th>
            <th>{{events.day[5].name}}</th>
            <th>{{events.day[4].name}}</th>
            <th>{{events.day[3].name}}</th>
            <th>{{events.day[2].name}}</th>
            <th>{{events.day[1].name}}</th>
            <th>{{events.day[0].name}}</th>
          </tr>
        </thead>
         <tbody>
          <tr v-for="(zone, index) in events.zone" :key="index">
            <template v-if="zone">
              <td>{{zone.name}}</td>
              <td v-for="(day, index2)  in zone.day" :key="index2">{{ day }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </b-card> 
  </div>
</template>
 
<script>
//zones.find(z => z.pin == zones[zone.id])
import MainChartExample from './dashboard/WateringChart'
import { mapState } from 'vuex'

var moment = require('moment');

export default {
  name: 'dashboard',
  components: {
    MainChartExample
  },

  computed: {
    zones() {
      var zones = this.$store.state.zones;
      return zones;
    },
    events() {
      var events = this.$store.state.events;
      var zones = this.$store.state.zones;
      let recentEvents = events.filter(e => moment(e.timestamp).isAfter(moment().subtract(8, 'days').startOf('day')))
      let recentWateringEvents = recentEvents.filter(e => e.type == 1)

      
      let data = []
      data.day = []
      data.zone = []
      for(let day = 0; day < 7; day++)
      {
        data.day[day] = []
        data.day[day].name = moment().subtract(day, 'days').format("ddd")
        data.day[day].zone = []
      }

      zones.forEach(zone => {
          let tempZone = {}
          tempZone.day = []
          tempZone.name = zone.name

          for(let day = 0; day < 7; day++)
          {
            let daysWateringEvents = recentWateringEvents.filter(e => moment(e.timestamp).isAfter(moment().subtract(6-day, 'days').startOf('day')) && moment(e.timestamp).isBefore(moment().subtract(6-day-1, 'days').startOf('day')))
            
            let volume = daysWateringEvents.filter(e => e.zone == zone.pin).reduce((acc,val) => acc + val.value, 0)
            if (volume >= 1) tempZone.day[day] = volume.toFixed(0) + " L";
            else if (volume > 0) tempZone.day[day] = volume.toFixed(1) + " L";
            else tempZone.day[day] = '-';
            //console.log("zone: " + zone + " day: " + day + " value: " + tempZone.day[day])
          }
          data.zone.push(tempZone)
      });
      return data;
    },
    status() {
      var status = this.$store.state.status;
      return status;
    }
  },

  mounted () {
    //this.$store.dispatch('getHistory')
    this.$store.dispatch("getEvents");
    this.$store.dispatch("getZones");
    this.$store.dispatch("getHourly");
    this.$store.dispatch("getStatus");
    setInterval(() => this.$store.dispatch("getStatus"), 1000);
  },

  data: function () {
    return {
      selected: 'Week'
    }
  },

  methods: {
    formatDate(date) {
      return moment(date).format("ddd hh:mm")
    }
  }

  // computed: mapState([
  //   'schedule'
  // ])
}
</script>