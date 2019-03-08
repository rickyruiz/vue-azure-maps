<script lang="ts">
import { atlas } from 'types'
import { ControlPosition } from 'azure-maps-control'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapControl from './AzureMapControl.vue'

/**
 * Compass control adds the ability to change the rotation of the `atlas.Map`.
 */
export default Vue.extend({
  name: 'AzureMapCompassControl',

  functional: true,

  props: {
    position: {
      type: String as Prop<ControlPosition>,
      default: ControlPosition.BottomRight,
    },
  },

  render(createElement, context) {
    //@ts-ignore Azure Maps Control types are incorrect, it declares 'controls' instead of 'control'
    // Construct a compass control
    const compassControl: atlas.controls.CompassControl = new context.parent.$_azureMaps.atlas.control.CompassControl()

    return createElement(AzureMapControl, {
      props: {
        control: compassControl,
        options: context.props,
      },
    })
  },
})
</script>
