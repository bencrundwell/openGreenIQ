<template>
  <div class="animated fadeIn">
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
  name: "history",
  mounted() {
    this.$store.dispatch("getEvents");
  },
  computed: {
    events() {
      var events = this.$store.state.events;
      return events;
    }
    // formatDate: function(date) {
    //   return moment(date).format("ddd")
    // },
    // moment: function () {
    //   return moment();
    // },
    // count: function(date) {
    //   return date
    // }
  },
  methods: {
    formatDate(date) {
      return moment(date).format("ddd Do @ hh:mm")
    }
  }
};
</script>