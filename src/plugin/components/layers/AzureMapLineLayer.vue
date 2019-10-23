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

enum AzureMapLineLayerEvent {
  Created = 'created',
}

const state = Vue.observable({ id: 0 })

/**
 * Renders line data on the map.
 */
export default Vue.extend({
  name: 'AzureMapLineLayer',

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
      type: Object as Prop<atlas.LineLayerOptions | null>,
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

    // Create the line layer
    const lineLayer = new this.$_azureMaps.atlas.layer.LineLayer(
      dataSource,
      this.id || `azure-map-line-layer-${state.id++}`,
      this.options || undefined
    )

    this.$emit(AzureMapLineLayerEvent.Created, lineLayer)

    this.$watch(
      'options',
      (newOptions: atlas.LineLayerOptions | null) => {
        lineLayer.setOptions(newOptions || {})
      },
      {
        deep: true,
      }
    )

    // Add the layer to the map
    map.layers.add(lineLayer)

    // Remove the layer when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.layers.remove(lineLayer)
    })

    // Add the layer events to the map
    addMapEventListeners({
      map,
      target: lineLayer,
      listeners: this.$listeners,
      reservedEventTypes: Object.values(AzureMapLineLayerEvent),
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
