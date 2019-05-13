<template>
  <div id="app">
    <h1>openGreenIQ</h1>
    <h2>Schedule</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Zone</th>
          <th>Days</th>
          <th>Time</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in schedule" :key="item.id">
          <td>{{ item.zone }}</td>
          <td>
            <span v-if="item.days&64">M </span>
            <span v-if="item.days&32">Tu </span>
            <span v-if="item.days&16">W </span>
            <span v-if="item.days&8">Th </span>
            <span v-if="item.days&4">F </span>
            <span v-if="item.days&2">Sa </span>
            <span v-if="item.days&1">Su </span>
          </td>
          <td>{{ Math.floor(item.start_time/60) }}:{{ (item.start_time%60).toString().padStart(2, '0') }}</td>
          <td>{{ item.duration/60 }}</td>
        </tr>
      </tbody>
    </table>

    <h2>History</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Rainfall(mm)</th>
          <th>Cloud</th>
          <th>ET(mm/day)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item.id">
          <td>
            {{ new Date(Date.parse(item.date)).getDate() }}-{{ new Date(Date.parse(item.date)).getMonth()+1 }}-{{ new Date(Date.parse(item.date)).getFullYear() }}
          </td>
          <td>{{ item.rainfall }}</td>
          <td>{{ item.cloud }}%</td>
          <td>{{ item.evapotranspiration }}</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Hourly</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Rainfall(mm)</th>
          <th>Cloud</th>
          <th>ET(mm/day)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in hourly" :key="item.id">
          <td>
            {{ (item.id-1).toString().padStart(2, '0') }}00
          </td>
          <td>{{ item.rainfall }}</td>
          <td>{{ item.cloud }}%</td>
          <td>{{ item.evapotranspiration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import APIService from './APIService';
// const api = new APIService();

export default {
  data () {
    return {
      schedule: 'loading',
      history: 'loading',
      hourly: 'loading'
    }
  },
  async created () {
    this.getValues();
  },
  methods: {
    async getValues() {
      this.schedule = await APIService.getAPI('schedule');
      this.hourly = await APIService.getAPI('hourly');
      this.history = await APIService.getAPI('history');
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
