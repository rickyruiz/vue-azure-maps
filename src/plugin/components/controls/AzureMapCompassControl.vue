<script lang="ts">
import { getOptionsFromProps } from '@/plugin/utils'
import { atlas } from 'types'
import { ControlPosition, ControlStyle } from 'azure-maps-control'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapControl from './AzureMapControl.vue'

/**
 * Compass control adds the ability to change the rotation of the `atlas.Map`.
 */
export default Vue.extend({
  name: 'AzureMapCompassControl',

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
     * The angle that the map will rotate with each click of the control.
     * Default `15`.
     * @default 15
     */
    rotationDegreesDelta: {
      type: Number,
      default: 15,
    },

    /**
     * The style of the control.
     * Default `ControlStyle.light`
     * @default ControlStyle.light
     */
    controlStyle: {
      type: String as Prop<ControlStyle>,
      default: ControlStyle.light,
    },
  },

  render(createElement) {
    // Construct a compass control
    return createElement(AzureMapControl, {
      props: {
        control: new this.$_azureMaps.atlas.control.CompassControl({
          rotationDegreesDelta: this.rotationDegreesDelta,
          style: this.controlStyle,
        }),
        options: {
          position: this.position,
        } as atlas.ControlOptions,
      },
    })
  },
})
</script>
