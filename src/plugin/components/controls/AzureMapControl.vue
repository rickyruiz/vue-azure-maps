<script lang="ts">
import { atlas } from 'types'
import { Control, ControlOptions } from 'azure-maps-control'
import Vue from 'vue'
import { Prop } from 'vue/types/options'

/**
 * Adds a control to the `atlas.Map`.
 */
export default Vue.extend({
  name: 'AzureMapControl',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  props: {
    control: {
      type: Object as Prop<Control>,
      default: null,
      required: true,
    },

    options: {
      type: Object as Prop<ControlOptions>,
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
        `Invalid <AzureMapControl> map instance.\nPlease make sure <AzureMapControl> is a descendant of <AzureMap>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Add the control to the map
    map.controls.add(this.control, this.options || undefined)
  },

  render(createElement) {
    return createElement()
  },
})
</script>
