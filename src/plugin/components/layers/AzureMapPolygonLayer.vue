<script lang="ts">
import { addEventsFromListeners } from '@/plugin/utils'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
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
      type: Object as Prop<atlas.PolygonLayerOptions | null>,
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
        `Invalid <AzureMapPolygonLayer> map instance.\nPlease make sure <AzureMapPolygonLayer> is a descendant of <AzureMap>.`
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
        `Invalid <AzureMapPolygonLayer> data source.\nPlease make sure <AzureMapPolygonLayer> is a descendant of <AzureMapDataSource>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

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
    this.addEventsFromListeners({
      map,
      target: polygonLayer,
      reservedEventTypes: Object.values(AzureMapPolygonLayerEvent),
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
