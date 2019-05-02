<script lang="ts">
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapLayer from './AzureMapLayer.vue'

/**
 * Tile layers allow you to superimpose images on top of Azure Maps base map tiles.
 */
export default Vue.extend({
  name: 'AzureMapTileLayer',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   * Inject the `getDataSource` function to get the `atlas.source.DataSource` instance
   */
  inject: ['getMap', 'getDataSource'],

  props: {
    options: {
      type: Object as Prop<atlas.TileLayerOptions>,
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
        `Invalid <AzureMapTileLayer> map instance.\nPlease make sure <AzureMapTileLayer> is a descendant of <AzureMap>.`
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
        `Invalid <AzureMapTileLayer> data source.\nPlease make sure <AzureMapTileLayer> is a descendant of <AzureMapDataSource>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Retrieve the data source from the injected function
    const dataSource = getDataSource()

    // Create the tile layer
    const tileLayer = new this.$_azureMaps.atlas.layer.TileLayer(this.options)

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
  },

  render(createElement) {
    return createElement()
  },
})
</script>
