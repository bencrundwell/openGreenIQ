<template>
  <div id="app">
    <h1>openGreenIQ</h1>
    <h2>Schedule</h2>
        <p>{{ schedule }}</p>
  </div>
</template>

<script>
import APIService from './APIService';
// const api = new APIService();

export default {
  data () {
    return {
      schedule: 'Hello'
    }
  },
  async created () {
    this.getSchedule()
  },
  methods: {
    async getSchedule() {
      this.schedule = await APIService.getSchedule()
    }
  }
}

// module.exports = {
//   data: function () {
//     return {
//       schedule: await APIService.getSchedule()
//     }
//   }
// }
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
