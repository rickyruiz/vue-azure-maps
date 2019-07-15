<script lang="ts">
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'

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
      type: [String, Object] as Prop<string | HTMLImageElement | ImageData>[],
      default: null,
      required: true,
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
        `Invalid <AzureMapImageSpriteIcon> map instance.\nPlease make sure <AzureMapImageSpriteIcon> is a descendant of <AzureMap>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Add the icon to the map's image sprite
    map.imageSprite
      .add(this.id, this.icon)
      .then(() => {
        this.$emit(AzureMapImageSpriteIconEvent.Added, this.id)

        // Remove the icon before the component is destroyed
        this.$once('hook:beforeDestroy', () => {
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
