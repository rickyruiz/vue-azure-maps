<script lang="ts">
import {
  getMapInjection,
  getDataSourceInjection,
} from '@/plugin/utils/dependency-injection'
import addMapEventListeners from '@/plugin/utils/add-map-event-listeners'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapLayer from './AzureMapLayer.vue'

enum AzureMapSymbolLayerEvent {
  Created = 'created',
}

const state = Vue.observable({ id: 0 })

/**
 * A symbol layer uses text or icons to render point-based data wrapped in the DataSource as symbols on the map.
 */
export default Vue.extend({
  name: 'AzureMapSymbolLayer',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   * Inject the `getDataSource` function to get the `atlas.source.DataSource` instance
   */
  inject: ['getMap', 'getDataSource'],

  props: {
    id: {
      type: String,
      default: '',
    },

    options: {
      type: Object as Prop<atlas.SymbolLayerOptions | null>,
      default: null,
    },
  },

  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Look for the injected function that retreives the data source instance
    const getDataSource = getDataSourceInjection(this)

    if (!getDataSource) return

    // Retrieve the data source from the injected function
    const dataSource = getDataSource()

    // Create the symbol layer
    const symbolLayer = new this.$_azureMaps.atlas.layer.SymbolLayer(
      dataSource,
      this.id || `azure-map-symbol-layer-${state.id++}`,
      this.options || undefined
    )

    this.$emit(AzureMapSymbolLayerEvent.Created, symbolLayer)

    // Watch for options changes
    this.$watch(
      'options',
      (newOptions: atlas.SymbolLayerOptions | null) => {
        symbolLayer.setOptions(newOptions || {})
      },
      {
        deep: true,
      }
    )

    // Add the layer to the map
    map.layers.add(symbolLayer)

    // Remove the layer when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.layers.remove(symbolLayer)
    })

    // Add the layer events to the map
    addMapEventListeners({
      map,
      target: symbolLayer,
      listeners: this.$listeners,
      reservedEventTypes: Object.values(AzureMapSymbolLayerEvent),
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
