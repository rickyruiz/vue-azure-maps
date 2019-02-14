<template>
  <AzureMapControl
    v-slot:default="{ map }"
    :options="mapOptions"
    class="azure-map"
  >
    <AzureMapSymbolLayer
      v-slot:default="{ dataSource }"
      :map="map"
    >
      <AzureMapShape
        :data-source="dataSource"
        :longitude="longitude"
        :latitude="latitude"
      />
    </AzureMapSymbolLayer>
  </AzureMapControl>
</template>

<script lang="ts">
import { AzureMapControl, AzureMapSymbolLayer, AzureMapShape } from '@/plugin'
import { atlas } from 'types'
import Vue from 'vue'

type MapOptions = atlas.ServiceOptions &
  atlas.CameraOptions &
  atlas.StyleOptions &
  atlas.UserInteractionOptions

export default Vue.extend({
  name: 'AzureMapExample',

  components: {
    AzureMapControl,
    AzureMapSymbolLayer,
    AzureMapShape,
  },

  data() {
    return {
      // Azure map options
      mapOptions: {
        center: [-122.33, 47.6],
        zoom: 12,
      } as MapOptions,

      // Azure shape position
      longitude: -122.33,
      latitude: 47.6,
    }
  },
})
</script>

<style scoped>
.azure-map {
  width: 100%;
  height: 100%;
}
</style>
