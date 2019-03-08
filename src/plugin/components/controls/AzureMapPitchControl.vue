<script lang="ts">
import { atlas } from 'types'
import { ControlPosition } from 'azure-maps-control'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapControl from './AzureMapControl.vue'

/**
 * Pitch control adds the ability to change the pitch of the `atlas.Map`.
 */
export default Vue.extend({
  name: 'AzureMapPitchControl',

  functional: true,

  props: {
    position: {
      type: String as Prop<ControlPosition>,
      default: ControlPosition.BottomRight,
    },
  },

  render(createElement, context) {
    //@ts-ignore Azure Maps Control types are incorrect, it declares 'controls' instead of 'control'
    // Construct a pitch control
    const pitchControl: atlas.controls.PitchControl = new context.parent.$_azureMaps.atlas.control.PitchControl()

    return createElement(AzureMapControl, {
      props: {
        control: pitchControl,
        options: context.props,
      },
    })
  },
})
</script>
