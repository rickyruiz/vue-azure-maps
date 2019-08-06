<script lang="ts">
import { addEventsFromListeners } from '@/plugin/utils'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapLayer from './AzureMapLayer.vue'

enum AzureMapTileLayerEvent {
  Created = 'created',
}

const state = Vue.observable({ id: 0 })

/**
 * Tile layers allow you to superimpose images on top of Azure Maps base map tiles.
 */
export default Vue.extend({
  name: 'AzureMapTileLayer',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  props: {
    id: {
      type: String,
      default: '',
    },

    options: {
      type: Object as Prop<atlas.TileLayerOptions | null>,
      default: null,
    },
  },

  created() {
    //@ts-ignore There is no TypeScript support for injections without decorators
    // Look for the function that retreives the map instance
    const { getMap }: { getMap: () => atlas.Map } = this

    if (!getMap) {
      if (process.env.NODE_ENV === 'production') return
      // If the function that retreives the map instance is not available,
      // warn the user that is not a descendant of an ancestor component that provides the method
      return console.warn(
        `Invalid <AzureMapTileLayer> map instance.\nPlease make sure <AzureMapTileLayer> is a descendant of <AzureMap>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Create the tile layer
    const tileLayer = new this.$_azureMaps.atlas.layer.TileLayer(
      this.options || undefined,
      this.id || `azure-map-tile-layer-${state.id++}`
    )

    this.$emit(AzureMapTileLayerEvent.Created, tileLayer)

    // Watch for options changes
    this.$watch(
      'options',
      (newOptions: atlas.TileLayerOptions | null) => {
        tileLayer.setOptions(newOptions || {})
      },
      {
        deep: true,
      }
    )

    // Add the layer to the map
    map.layers.add(tileLayer)

    // Remove the layer when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.layers.remove(tileLayer)
    })

    // Add the layer events to the map
    this.addEventsFromListeners({
      map,
      target: tileLayer,
      reservedEventTypes: Object.values(AzureMapTileLayerEvent),
    })
  },

  methods: {
    addEventsFromListeners,
  },

  render(createElement) {
    return createElement()
  },
})
</script>
