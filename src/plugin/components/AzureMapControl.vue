<template>
  <div
    :id="mapContainer"
    :style="{ width, height }"
  >
    <template
      v-if="isMapReady"
    >
      <slot
        :map="map"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { atlas } from 'types'
import Vue from 'vue'

enum AzureMapControlEvents {
  Ready = 'ready',
}

const state = Vue.observable({ id: 0 })

export default Vue.extend({
  name: 'AzureMapControl',

  props: {
    container: {
      type: String,
      default: '',
    },

    width: {
      type: String,
      default: null,
    },

    height: {
      type: String,
      default: null,
    },

    options: {
      type: Object as () => atlas.ServiceOptions &
        atlas.CameraOptions &
        atlas.StyleOptions &
        atlas.UserInteractionOptions,
      default: null,
    },
  },

  data() {
    return {
      mapContainer: '',

      map: null as atlas.Map | null,

      isMapReady: false,
    }
  },

  created() {
    this.setContainer()
  },

  async mounted() {
    this.setSubscription()
    this.initializeMap()
  },

  methods: {
    setSubscription(): void {
      //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
      this.$_azureMaps.atlas.setSubscriptionKey(this.$_azureMaps.key)
    },

    initializeMap(): void {
      // Instantiate map to the div with id got from props or auto-generated.
      this.map = new this.$_azureMaps.atlas.Map(this.mapContainer, this.options)

      // Wait until the map resources are ready.
      this.map.events.add('ready', this.mapReadyCallback)
    },

    setContainer(): void {
      this.mapContainer = this.container || `azure-map-${state.id++}`
    },

    mapReadyCallback(e: atlas.MapEvent): void {
      this.$emit(AzureMapControlEvents.Ready, e)
      this.isMapReady = true
    },
  },
})
</script>
