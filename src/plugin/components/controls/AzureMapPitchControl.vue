<script lang="ts">
import { atlas } from 'types'
import { ControlPosition, ControlStyle } from 'azure-maps-control'
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
    /**
     * The position where the control will be placed on the map.
     */
    position: {
      type: String as Prop<ControlPosition>,
      default: ControlPosition.BottomRight,
      validator: (value: string) =>
        Object.values(ControlPosition).includes(value),
    },

    /**
     * The angle that the map will tilt with each click of the control.
     * Default `10`.
     * @default 10
     */
    pitchDegreesDelta: {
      type: Number,
      default: 10,
    },

    /**
     * The style of the control.
     * Default `ControlStyle.light`
     * @default ControlStyle.light
     */
    style: {
      type: String as Prop<ControlStyle>,
      default: ControlStyle.light,
    },
  },

  render(createElement, context) {
    // Construct a pitch control
    return createElement(AzureMapControl, {
      props: {
        control: new context.parent.$_azureMaps.atlas.control.PitchControl({
          pitchDegreesDelta: context.props.pitchDegreesDelta,
          style: context.props.style,
        }),
        options: {
          position: context.props.position,
        } as atlas.ControlOptions,
      },
    })
  },
})
</script>
