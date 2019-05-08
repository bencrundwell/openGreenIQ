<template>
  <div id="app">
    <h1>openGreenIQ</h1>
    <h2>Schedule</h2>
        <p>{{ schedule }}</p>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
      schedule: 'Hello!'
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
