<script lang="ts">
import { getMapInjection } from '@/plugin/utils/dependency-injection'
import addMapEventListeners from '@/plugin/utils/add-map-event-listeners'
import { atlas } from 'types'
import Vue, { PropType } from 'vue'

enum AzureMapImageLayerEvent {
  Created = 'created',
}

const state = Vue.observable({ id: 0 })

/**
 * Overlay an image to fixed set of coordinates on the map.
 */
export default Vue.extend({
  name: 'AzureMapImageLayer',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  props: {
    id: {
      type: String,
      default: '',
    },

    options: {
      type: Object as PropType<atlas.ImageLayerOptions | null>,
      default: null,
    },
  },

  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Create the image layer
    const imageLayer = new this.$_azureMaps.atlas.layer.ImageLayer(
      this.options || {},
      this.id || `azure-map-image-layer-${state.id++}`
    )

    this.$emit(AzureMapImageLayerEvent.Created, imageLayer)

    // Watch for options changes
    this.$watch(
      'options',
      (newOptions: atlas.ImageLayerOptions | null) => {
        imageLayer.setOptions(newOptions || {})
      },
      {
        deep: true,
      }
    )

    // Add the layer to the map
    map.layers.add(imageLayer)

    // Remove the layer when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.layers.remove(imageLayer)
    })

    // Add the layer events to the map
    addMapEventListeners({
      map,
      target: imageLayer,
      listeners: this.$listeners,
      reservedEventTypes: Object.values(AzureMapImageLayerEvent),
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
