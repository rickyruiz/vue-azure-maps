<script lang="ts">
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapLayer from './AzureMapLayer.vue'

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
      type: Object as Prop<atlas.LineLayerOptions>,
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
        `Invalid <AzureMapLineLayer> map instance.\nPlease make sure <AzureMapLineLayer> is a descendant of <AzureMap>.`
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
        `Invalid <AzureMapLineLayer> data source.\nPlease make sure <AzureMapLineLayer> is a descendant of <AzureMapDataSource>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Retrieve the data source from the injected function
    const dataSource = getDataSource()

    // Create the line layer
    const lineLayer = new this.$_azureMaps.atlas.layer.LineLayer(
      dataSource,
      this.id || `azure-map-line-layer-${state.id++}`,
      this.options
    )

    // TODO: Check if LineLayer has a setOptions method.
    // It is not included in atlas types.

    // this.$watch(
    //   'options',
    //   (newOptions: atlas.LineLayerOptions | null) => {
    //     lineLayer.setOptions(newOptions || {})
    //   },
    //   {
    //     deep: true,
    //   }
    // )

    // Add the layer to the map
    map.layers.add(lineLayer)

    // Remove the layer when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.layers.remove(lineLayer)
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
