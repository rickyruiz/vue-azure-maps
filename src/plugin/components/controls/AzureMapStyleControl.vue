<script lang="ts">
import { atlas } from 'types'
import { ControlPosition } from 'azure-maps-control'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapControl from './AzureMapControl.vue'

/**
 * Style control adds the ability to change the style of the `atlas.Map`.
 */
export default Vue.extend({
  name: 'AzureMapStyleControl',

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
    const styleControl: atlas.controls.StyleControl = new context.parent.$_azureMaps.atlas.control.StyleControl()

    return createElement(AzureMapControl, {
      props: {
        control: styleControl,
        options: context.props,
      },
    })
  },
})
</script>
