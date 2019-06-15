<template>
  <div class="animated fadeIn">
    <b-card
    header-tag="header"
    footer-tag="footer">
      <div slot="header">
          <h4 class="card-title mb-0">Zones</h4>
      </div>
      <b-table striped hover :items="zones"></b-table>
    </b-card>
  </div>
</template>
 
<script>
import { mapState } from 'vuex'

export default {
  name: 'zones',
  mounted () {
    this.$store.dispatch('getZones')
  },
  computed: mapState([
    'zones'
  ])
}
</script>