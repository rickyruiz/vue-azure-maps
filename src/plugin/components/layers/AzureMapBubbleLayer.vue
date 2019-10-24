<script lang="ts">
import {
  getMapInjection,
  getDataSourceInjection,
} from '@/plugin/utils/dependency-injection'
import addMapEventListeners from '@/plugin/utils/add-map-event-listeners'
import { atlas } from 'types'
import Vue, { PropType } from 'vue'
import AzureMapLayer from './AzureMapLayer.vue'

enum AzureMapBubbleLayerEvent {
  Created = 'created',
}

const state = Vue.observable({ id: 0 })

/**
 * Renders Point objects as scalable circles (bubbles).
 */
export default Vue.extend({
  name: 'AzureMapBubbleLayer',

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
      type: Object as PropType<atlas.BubbleLayerOptions | null>,
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

    // Create the bubble layer
    const bubbleLayer = new this.$_azureMaps.atlas.layer.BubbleLayer(
      dataSource,
      this.id || `azure-map-bubble-layer-${state.id++}`,
      this.options || undefined
    )

    this.$emit(AzureMapBubbleLayerEvent.Created, bubbleLayer)

    // Watch for options changes
    this.$watch(
      'options',
      (newOptions: atlas.BubbleLayerOptions | null) => {
        bubbleLayer.setOptions(newOptions || {})
      },
      {
        deep: true,
      }
    )

    // Add the layer to the map
    map.layers.add(bubbleLayer)

    // Remove the layer when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.layers.remove(bubbleLayer)
    })

    // Add the layer events to the map
    addMapEventListeners({
      map,
      target: bubbleLayer,
      listeners: this.$listeners,
      reservedEventTypes: Object.values(AzureMapBubbleLayerEvent),
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
