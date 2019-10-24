<script lang="ts">
import { getMapInjection } from '@/plugin/utils/dependency-injection'
import { atlas } from 'types'
import Vue, { PropType } from 'vue'

enum AzureMapImageSpriteIconEvent {
  Error = 'error',
  Added = 'added',
  Removed = 'removed',
}

/**
 * Adds an icon image to the map's image sprite for use with symbols and patterns.
 */
export default Vue.extend({
  name: 'AzureMapImageSpriteIcon',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  props: {
    /**
     * The image's id.
     */
    id: {
      type: String,
      default: null,
      required: true,
    },

    /**
     * The image to add to the map's sprite. Can be a data URI, inline SVG, or image URL.
     */
    icon: {
      type: [String, Object] as PropType<string | HTMLImageElement | ImageData>,
      default: null,
      required: true,
    },
  },

  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Add the icon to the map's image sprite
    map.imageSprite
      .add(this.id, this.icon)
      .then(() => {
        this.$emit(AzureMapImageSpriteIconEvent.Added, this.id)

        // Remove the icon when the component is destroyed
        this.$once('hook:destroyed', () => {
          map.imageSprite.remove(this.id)
          this.$emit(AzureMapImageSpriteIconEvent.Removed, this.id)
        })
      })
      .catch(error => this.$emit(AzureMapImageSpriteIconEvent.Error, error))
  },

  render(createElement) {
    return createElement()
  },
})
</script>
