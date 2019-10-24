<script lang="ts">
import { getMapInjection } from '@/plugin/utils/dependency-injection'
import getOptionsFromProps from '@/plugin/utils/get-options-from-props'
import addMapEventListeners from '@/plugin/utils/add-map-event-listeners'
import { atlas } from 'types'
import Vue, { PropType } from 'vue'

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
      type: String as PropType<string | null>,
      default: null,
    },
    /**
     * A color value that replaces any {color} placeholder property that has been included in a string htmlContent.
     * default `"#1A73AA"`
     * @default "#1A73AA"
     */
    color: {
      type: String as PropType<string | null>,
      default: null,
    },
    /**
     * Indicates if the user can drag the position of the marker using the mouse or touch controls.
     * default `false`
     * @default false
     */
    draggable: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    /**
     * The HTML content of the marker. Can be an HTMLElement or HTML string.
     * Add {text} and {color} to HTML strings as placeholders to make it easy to update
     * these values in your marker by using the setOptions function of the HtmlMarker class.
     * This allows you to create a single HTML marker string that can be used as a template for multiple markers.
     */
    htmlContent: {
      type: String as PropType<string | HTMLElement | null>,
      default: null,
    },
    /**
     * An offset in pixels to move the popup relative to the markers center.
     * Negatives indicate left and up.
     * default `[0, -18]`
     * @default [0, -18]
     */
    pixelOffset: {
      type: Array as PropType<atlas.Pixel | null>,
      default: null,
    },
    /**
     * The position of the marker.
     * default `[0, 0]`
     * @default [0, 0]
     */
    position: {
      type: Array as PropType<atlas.data.Position | null>,
      default: null,
    },
    /**
     * A popup that is attached to the marker.
     */
    popup: {
      type: Object as PropType<atlas.Popup | null>,
      default: null,
    },
    /**
     * A string of text that replaces any {text} placeholder property that has been included in a string htmlContent.
     */
    text: {
      type: String as PropType<string | null>,
      default: null,
    },
    /**
     * Specifies if the marker is visible or not.
     * default `true`
     * @default true
     */
    visible: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
  },

  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Create the HTML marker
    const marker = new this.$_azureMaps.atlas.HtmlMarker(
      getOptionsFromProps({ props: this.$props })
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
        let newOptions = getOptionsFromProps<atlas.HtmlMarkerOptions>({
          props: this.$props,
        })
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

    // Add the html marker events to the map
    addMapEventListeners({
      map,
      target: marker,
      listeners: this.$listeners,
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
