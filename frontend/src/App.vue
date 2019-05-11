<template>
  <div id="app">
    <h1>openGreenIQ</h1>
    <h2>Schedule</h2>
    <p>{{ schedule }}</p>
    <h2>History</h2>
    <p>{{ history }}</p>
  </div>
</template>

<script>
import APIService from './APIService';
// const api = new APIService();

export default {
  data () {
    return {
      schedule: 'Hello',
      history: 'test'
    }
  },
  async created () {
    this.getSchedule();
    this.getRainfall();
    this.getHistory();
  },
  methods: {
    async getSchedule() {
      this.schedule = await APIService.getSchedule()
    },
    async getRainfall() {
      this.rainfall = await APIService.getRainfall()
    },
    async getHistory() {
      this.history = await APIService.getHistory()
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
