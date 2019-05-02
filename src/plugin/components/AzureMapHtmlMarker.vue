<script lang="ts">
import { getOptionsFromProps } from '@/plugin/utils'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'

/**
 * Adds a custom HTML such as an image file to the map as an HTML Marker.
 */
export default Vue.extend({
  name: 'AzureMapHtmlMarker',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  props: {
    /**
     * Indicates the marker's location relative to its position on the map.
     * Optional values: `"center"`, `"top"`, `"bottom"`, `"left"`, `"right"`,
     * `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`.
     * Default `"center"`
     * @default "center"
     */
    anchor: {
      type: String as Prop<string | null>,
      default: null,
    },
    /**
     * A color value that replaces any {color} placeholder property that has been included in a string htmlContent.
     * default `"#1A73AA"`
     * @default "#1A73AA"
     */
    color: {
      type: String as Prop<string | null>,
      default: null,
    },
    /**
     * Indicates if the user can drag the position of the marker using the mouse or touch controls.
     * default `false`
     * @default false
     */
    draggable: {
      type: Boolean as Prop<boolean | null>,
      default: null,
    },
    /**
     * The HTML content of the marker. Can be an HTMLElement or HTML string.
     * Add {text} and {color} to HTML strings as placeholders to make it easy to update
     * these values in your marker by using the setOptions function of the HtmlMarker class.
     * This allows you to create a single HTML marker string that can be used as a template for multiple markers.
     */
    htmlContent: {
      type: String as Prop<string | HTMLElement | null>,
      default: null,
    },
    /**
     * An offset in pixels to move the popup relative to the markers center.
     * Negatives indicate left and up.
     * default `[0, -18]`
     * @default [0, -18]
     */
    pixelOffset: {
      type: Array as Prop<atlas.Pixel | null>,
      default: null,
    },
    /**
     * The position of the marker.
     * default `[0, 0]`
     * @default [0, 0]
     */
    position: {
      type: Array as Prop<atlas.data.Position | null>,
      default: null,
    },
    /**
     * A popup that is attached to the marker.
     */
    popup: {
      type: Object as Prop<atlas.Popup | null>,
      default: null,
    },
    /**
     * A string of text that replaces any {text} placeholder property that has been included in a string htmlContent.
     */
    text: {
      type: String as Prop<string | null>,
      default: null,
    },
    /**
     * Specifies if the marker is visible or not.
     * default `true`
     * @default true
     */
    visible: {
      type: Boolean as Prop<boolean | null>,
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
        `Invalid <AzureMapHtmlMarker> map instance.\nPlease make sure <AzureMapHtmlMarker> is a descendant of <AzureMap>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Create the HTML marker
    const marker = new this.$_azureMaps.atlas.HtmlMarker(
      this.getOptionsFromProps<atlas.HtmlMarkerOptions>()
    )

    // Watch for all props changes
    this.$watch(
      () => {
        let values = ''
        for (const value of Object.values(this.$props)) {
          values += value
        }
        return values
      },
      () => {
        let newOptions = this.getOptionsFromProps<atlas.HtmlMarkerOptions>()
        if (newOptions) {
          marker.setOptions(newOptions)
        }
      }
    )

    // Add the marker to the map
    map.markers.add(marker)

    // Remove the marker when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.markers.remove(marker)
    })
  },

  methods: {
    getOptionsFromProps,
  },

  render(createElement) {
    return createElement()
  },
})
</script>
