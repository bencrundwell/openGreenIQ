<template>
  <div class="animated fadeIn">
    <div class="row">
      <div v-for="item in zones" :key="item.id" class="col-sm-6 col-lg-4" >
        <!-- <a v-bind:href=""> -->
          <div class="brand-card">
            <div class="brand-card-header h2">
              {{item.pin }}: {{ item.name }}
            </div>
            <div class="brand-card-body">
              <div>
                <div class="text-value">{{ item.avg_flow }} L/h</div>
                <div class="text-uppercase text-muted small">Flow</div>
              </div>
              <div>
                <div class="text-value">{{ item.area }} m&sup2;</div>
                <div class="text-uppercase text-muted small">Area</div>
              </div>
            </div>
            <a v-bind:href="'/zones/'+item.pin" class="stretched-link"></a>
          </div>
        <!-- </a> -->
      </div>
    </div>
  </div>
  
</template>
 
<script>
import { mapState } from 'vuex'

export default {
  name: 'zoneList',
  mounted () {
    this.$store.dispatch('getZones')
  },
  computed: mapState([
    'zones'
  ])
}
</script>