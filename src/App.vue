<template>
  <div
    id="app"
  >
    <AzureMapExample/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AzureMapExample from './components/vue-azure-maps/AzureMapExample.vue'

export default Vue.extend({
  name: 'App',

  components: {
    AzureMapExample,
  },
})
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

#app {
  height: 100%;
}

p {
  margin: 0;
}
</style>
