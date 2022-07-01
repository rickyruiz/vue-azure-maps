<script lang="ts">
import { getMapInjection } from '@/plugin/utils/dependency-injection'
import { indoor } from 'azure-maps-indoor'
import Vue, { PropType } from 'vue'

/**
 * Adds a custom HTML such as an image file to the map as an HTML Marker.
 */
export default Vue.extend({
  name: 'AzureMapIndoor',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  props: {
    /**
     * Tile Set Id
     */
    tilesetId: {
      type: String as PropType<string>,
      default: null,
    },
    /**
     * State Set Id
     */
    statesetId: {
      type: String as PropType<string>,
      default: null,
    },
  },
  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

    // Retrieve the map instance from the injected function
    const map = getMap()
    console.log(this.$_azureMaps.atlas)
    if (!this.$_azureMaps.atlas.indoor) this.$_azureMaps.atlas.indoor = indoor
    console.log(this.tilesetId, this.statesetId)
    const indoorManager = new this.$_azureMaps.atlas.indoor.IndoorManager(map, {
      tilesetId: this.tilesetId,
      statesetId: this.statesetId,
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
