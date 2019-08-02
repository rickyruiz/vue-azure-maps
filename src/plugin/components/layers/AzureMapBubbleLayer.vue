<script lang="ts">
import { addEventsFromListeners } from '@/plugin/utils'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
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
      type: Object as Prop<atlas.BubbleLayerOptions | null>,
      default: null,
    },
  },

  mounted() {
    //@ts-ignore There is no TypeScript support for injections without decorators
    // Look for the function that retreives the map instance
    const { getMap }: { getMap: () => atlas.Map } = this

    if (!getMap) {
      if (process.env.NODE_ENV === 'production') return
      // If the function that retreives the map instance is not available,
      // warn the user that is not a descendant of an ancestor component that provides the method
      return console.warn(
        `Invalid <AzureMapBubbleLayer> map instance.\nPlease make sure <AzureMapBubbleLayer> is a descendant of <AzureMap>.`
      )
    }

    //@ts-ignore There is no TypeScript support for injections without decorators
    // Look for the function that retreives the data source instance
    const {
      getDataSource,
    }: { getDataSource: () => atlas.source.DataSource } = this

    if (!getDataSource) {
      if (process.env.NODE_ENV === 'production') return
      // If the function that retreives the data source is not available,
      // warn the user that is not a descendant of an ancestor component that provides the method
      return console.warn(
        `Invalid <AzureMapBubbleLayer> data source.\nPlease make sure <AzureMapBubbleLayer> is a descendant of <AzureMapDataSource>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

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
    this.addEventsFromListeners({
      map,
      target: bubbleLayer,
      reservedEventTypes: Object.values(AzureMapBubbleLayerEvent),
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
