<script lang="ts">
import { atlas } from 'types'
import { ControlPosition, ControlStyle } from 'azure-maps-control'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapControl from './AzureMapControl.vue'

/**
 * Zoom control adds the ability to zoom in and out of the `atlas.Map`.
 */
export default Vue.extend({
  name: 'AzureMapZoomControl',

  props: {
    /**
     * The position where the control will be placed on the map.
     */
    position: {
      type: String as Prop<atlas.ControlPosition>,
      default: ControlPosition.BottomRight,
      validator: (value: atlas.ControlPosition) =>
        Object.values(ControlPosition).includes(value),
    },

    /**
     * The extent to which the map will zoom with each click of the control.
     * Default `1`.
     * @default 1
     */
    zoomDelta: {
      type: Number,
      default: 1,
    },

    /**
     * The style of the control.
     * Default `ControlStyle.light`
     * @default ControlStyle.light
     */
    controlStyle: {
      type: String as Prop<atlas.ControlStyle>,
      default: ControlStyle.light,
    },
  },

  render(createElement) {
    // Construct a zoom control
    return createElement(AzureMapControl, {
      props: {
        control: new this.$_azureMaps.atlas.control.ZoomControl({
          zoomDelta: this.zoomDelta,
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
