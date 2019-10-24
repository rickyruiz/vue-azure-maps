<script lang="ts">
import {
  getMapInjection,
  getDataSourceInjection,
} from '@/plugin/utils/dependency-injection'
import addMapEventListeners from '@/plugin/utils/add-map-event-listeners'
import { atlas } from 'types'
import Vue, { PropType } from 'vue'
import AzureMapLayer from './AzureMapLayer.vue'

enum AzureMapHeatMapLayerEvent {
  Created = 'created',
}

const state = Vue.observable({ id: 0 })

/**
 * Heat maps are a type of data visualization used to represent the density of data using a range of colors.
 */
export default Vue.extend({
  name: 'AzureMapHeatMapLayer',

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
      type: Object as PropType<atlas.HeatMapLayerOptions | null>,
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

    // Create the heat map layer
    const heatMapLayer = new this.$_azureMaps.atlas.layer.HeatMapLayer(
      dataSource,
      this.id || `azure-map-heat-map-layer-${state.id++}`,
      this.options || undefined
    )

    this.$emit(AzureMapHeatMapLayerEvent.Created, heatMapLayer)

    // Watch for options changes
    this.$watch(
      'options',
      (newOptions: atlas.HeatMapLayerOptions | null) => {
        heatMapLayer.setOptions(newOptions || {})
      },
      {
        deep: true,
      }
    )

    // Add the layer to the map
    map.layers.add(heatMapLayer)

    // Remove the layer when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.layers.remove(heatMapLayer)
    })

    // Add the layer events to the map
    addMapEventListeners({
      map,
      target: heatMapLayer,
      listeners: this.$listeners,
      reservedEventTypes: Object.values(AzureMapHeatMapLayerEvent),
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
