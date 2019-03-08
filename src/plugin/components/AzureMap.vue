<template>
  <div
    :id="mapId"
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
import { Prop } from 'vue/types/options'

enum AzureMapEvents {
  Ready = 'ready',
}

const state = Vue.observable({ id: 0 })

export default Vue.extend({
  name: 'AzureMap',

  provide(): {
    getMap: () => atlas.Map | null
  } {
    return {
      /**
       * Provide a function to retreive the `atlas.Map` instance for descendent components that need to inject it
       *
       * Note that this method will only be available in the descendent component if it uses `inject: ['getMap']`
       */
      getMap: this.getMap,
    }
  },

  props: {
    /**
     * The `atlas.Map` container width
     *
     * Note this property is optional because it could be specified using CSS
     */
    width: {
      type: String as Prop<string | null>,
      default: null,
    },

    /**
     * The `atlas.Map` container height
     *
     * Note this property is optional because it could be specified using CSS
     */
    height: {
      type: String as Prop<string | null>,
      default: null,
    },

    /**
     * The `atlas.Map` options
     */
    options: {
      type: Object as Prop<
        | atlas.ServiceOptions &
            atlas.CameraOptions &
            atlas.StyleOptions &
            atlas.UserInteractionOptions
        | null
      >,
      default: null,
    },
  },

  data() {
    return {
      /**
       * The `atlas.Map` container id
       */
      mapId: `azure-map-${state.id++}`,
      /**
       * The `atlas.Map` instance
       */
      map: null as atlas.Map | null,

      /**
       * Flag that indicates that the `atlas.Map` instance is ready
       */
      isMapReady: false,
    }
  },

  async mounted() {
    this.setSubscription()
    this.initializeMap()
  },

  methods: {
    setSubscription(): void {
      // Add the Azure Maps subscription key to the map SDK.
      this.$_azureMaps.atlas.setSubscriptionKey(this.$_azureMaps.key)
    },

    initializeMap(): void {
      // Instantiate map to the HTMLElement with the auto-generated map id.
      this.map = new this.$_azureMaps.atlas.Map(this.mapId, this.options || {})

      // Wait until the map resources are ready.
      this.map.events.add('ready', this.mapReadyCallback)
    },

    mapReadyCallback(mapEvent: atlas.MapEvent): void {
      // Emit the custom ready event
      this.$emit(AzureMapEvents.Ready, mapEvent)

      // Indicate that the map instance is ready,
      // which triggers descendent components creation
      this.isMapReady = true
    },

    getMap(): atlas.Map | null {
      // Return the map instance for descendent components injection
      return this.map
    },
  },
})
</script>
