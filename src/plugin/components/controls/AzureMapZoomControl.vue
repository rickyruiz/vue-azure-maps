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
    style: {
      type: String as Prop<ControlStyle>,
      default: ControlStyle.light,
    },
  },

  render(createElement, context) {
    // Construct a zoom control
    return createElement(AzureMapControl, {
      props: {
        control: new context.parent.$_azureMaps.atlas.control.ZoomControl({
          zoomDelta: context.props.zoomDelta,
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
