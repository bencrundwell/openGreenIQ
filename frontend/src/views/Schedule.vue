<template>
  <div class="animated fadeIn">
    <b-card
    header-tag="header"
    footer-tag="footer">
      <div slot="header">
          <h4 class="card-title mb-0">Watering Schedule</h4>
      </div>
      <b-table striped hover :items="items"></b-table>
    </b-card>
  </div>
</template>
 
<script>

export default {
  name: 'schedule',
  data: function () {
    return {
      items: [
          { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
    }
  }
}
</script>