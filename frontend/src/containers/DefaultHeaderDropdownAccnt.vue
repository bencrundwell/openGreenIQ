<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <i class="icon-bell"></i>
          <b-badge pill variant="danger">5</b-badge>
    </template>\
    <template slot="dropdown">
      <b-dropdown-item><i class="fa fa-wrench" />Settings</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return { itemsCount: 42 }
  }
}
</script>
