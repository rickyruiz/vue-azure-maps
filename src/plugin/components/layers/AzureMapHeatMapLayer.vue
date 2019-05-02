<script lang="ts">
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapLayer from './AzureMapLayer.vue'

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
      type: Object as Prop<atlas.HeatMapLayerOptions>,
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
        `Invalid <AzureMapHeatMapLayer> map instance.\nPlease make sure <AzureMapHeatMapLayer> is a descendant of <AzureMap>.`
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
        `Invalid <AzureMapHeatMapLayer> data source.\nPlease make sure <AzureMapHeatMapLayer> is a descendant of <AzureMapDataSource>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Retrieve the data source from the injected function
    const dataSource = getDataSource()

    // Create the heat map layer
    const heatMapLayer = new this.$_azureMaps.atlas.layer.HeatMapLayer(
      dataSource,
      this.id || `azure-map-heat-map-layer-${state.id++}`,
      this.options
    )

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
  },

  render(createElement) {
    return createElement()
  },
})
</script>
