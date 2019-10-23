<script lang="ts">
import { getMapInjection } from '@/plugin/utils/dependency-injection'
import getOptionsFromProps from '@/plugin/utils/get-options-from-props'
import { atlas } from 'types'
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
      type: Object as Prop<atlas.Control>,
      default: null,
      required: true,
    },

    options: {
      type: Object as Prop<atlas.ControlOptions>,
      default: null,
    },
  },

  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Add the control to the map
    map.controls.add(
      this.control,
      getOptionsFromProps<atlas.ControlOptions>({
        props: this.options,
      })
    )

    // Remove the control when the component is destroyed
    this.$once('hook:destroyed', () => {
      map.controls.remove(this.control)
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
