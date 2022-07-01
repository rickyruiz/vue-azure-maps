<template>
  <div id="app">
    <!-- <AzureMapExample /> -->
    <!-- <AzureMapSpiderClusterManagerExample/> -->
    <AzureIndoorMapExample />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import AzureMapExample from './components/vue-azure-maps/AzureMapExample.vue'
// import AzureMapSpiderClusterManagerExample from './components/vue-azure-maps/AzureMapSpiderClusterManagerExample.vue'
import AzureIndoorMapExample from './components/vue-azure-maps/AzureIndoorMapExample.vue'

export default Vue.extend({
  name: 'App',

  components: {
    // AzureMapExample,
    // AzureMapSpiderClusterManagerExample,
    AzureIndoorMapExample,
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
