<script lang="ts">
import {
  getMapInjection,
  getDataSourceInjection,
} from '@/plugin/utils/dependency-injection'
import addMapEventListeners from '@/plugin/utils/add-map-event-listeners'
import { atlas } from 'types'
import Vue, { PropType } from 'vue'
import AzureMapLayer from './AzureMapLayer.vue'

enum AzureMapPolygonLayerEvent {
  Created = 'created',
}

const state = Vue.observable({ id: 0 })

/**
 * A symbol layer uses text or icons to render point-based data wrapped in the DataSource as symbols on the map.
 */
export default Vue.extend({
  name: 'AzureMapPolygonLayer',

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
      type: Object as PropType<atlas.PolygonLayerOptions | null>,
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

    // Create the polygon layer
    const polygonLayer = new this.$_azureMaps.atlas.layer.PolygonLayer(
      dataSource,
      this.id || `azure-map-polygon-layer-${state.id++}`,
      this.options || undefined
    )

    this.$emit(AzureMapPolygonLayerEvent.Created, polygonLayer)

    // Watch for options changes
    this.$watch(
      'options',
      (newOptions: atlas.PolygonLayerOptions | null) => {
        polygonLayer.setOptions(newOptions || {})
      },
      {
        deep: true,
      }
    )

    // Add the layer to the map
    map.layers.add(polygonLayer)

    // Remove the layer when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.layers.remove(polygonLayer)
    })

    // Add the layer events to the map
    addMapEventListeners({
      map,
      target: polygonLayer,
      listeners: this.$listeners,
      reservedEventTypes: Object.values(AzureMapPolygonLayerEvent),
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
