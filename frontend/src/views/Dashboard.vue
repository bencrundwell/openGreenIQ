<template>
  <div class="animated fadeIn">

    <b-card>
      <b-row>
        <b-col sm="5">
          <h4 id="traffic" class="card-title mb-0">Weather Data</h4>
          <div class="small text-muted">November 2017</div>
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
    
    <!-- <b-card v-for="entry in schedule" :key="entry.id">
      {{ entry }}
    </b-card> -->
  </div>
</template>
 
<script>
import MainChartExample from './dashboard/WateringChart'
import { mapState } from 'vuex'

export default {
  name: 'dashboard',
  components: {
    MainChartExample
  },

  mounted () {
    //this.$store.dispatch('getHistory')
  },

  data: function () {
    return {
      selected: 'Week'
    }
  },

  // computed: mapState([
  //   'schedule'
  // ])
}
</script>