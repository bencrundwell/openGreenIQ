<template>
  <div class="animated fadeIn">
    <b-card
    header-tag="header"
    footer-tag="footer">
      <div slot="header">
          <h4 class="card-title mb-0">Watering Schedule</h4>
      </div>
      <!-- <b-table striped hover :items="schedule"></b-table> -->

      <table class="table b-table table-striped table-hover">
      <thead>
        <tr>
          <th>Zone</th>
          <th>Days</th>
          <th class="text-center">Time</th>
          <th class="text-center">Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in schedule" :key="item.id">
          <td>{{ item.name }}</td>
          <td>
            <span v-if="item.days_decode.mon">M </span>
            <span v-if="item.days_decode.tue">Tu </span>
            <span v-if="item.days_decode.wed">W </span>
            <span v-if="item.days_decode.thu">Th </span>
            <span v-if="item.days_decode.fri">F </span>
            <span v-if="item.days_decode.sat">Sa </span>
            <span v-if="item.days_decode.sun">Su </span>
          </td>
          <td class="text-center">{{ Math.floor(item.start_time/60) }}:{{ (item.start_time%60).toString().padStart(2, '0') }}</td>
          <td class="text-center">{{ item.duration/60 }}:{{ (item.duration%60).toString().padStart(2, '0') }}</td>
        </tr>
      </tbody>
    </table>
    </b-card>
  </div>
</template>
 
<script>
import { mapState } from 'vuex'

export default {
  name: 'schedule',
  mounted () {
    this.$store.dispatch('getSchedule')
  },
  computed: {
    schedule () {
      var schedule = this.$store.state.schedule
      schedule.map(item => {
        const old_days = item.days
        item.days_decode = []
        item.days_decode.mon = old_days&64
        item.days_decode.tue = old_days&32
        item.days_decode.wed = old_days&16
        item.days_decode.thu = old_days&8
        item.days_decode.fri = old_days&4
        item.days_decode.sat = old_days&2
        item.days_decode.sun = old_days&1
      })
      return schedule
    }
  }
}
</script>