<script lang="ts">
import { getMapInjection } from '@/plugin/utils/dependency-injection'
import addMapEventListeners from '@/plugin/utils/add-map-event-listeners'
import { atlas } from 'types'
import Vue, { PropType } from 'vue'
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
      type: Object as PropType<atlas.TileLayerOptions | null>,
      default: null,
    },
  },

  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

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
    addMapEventListeners({
      map,
      target: tileLayer,
      listeners: this.$listeners,
      reservedEventTypes: Object.values(AzureMapTileLayerEvent),
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
