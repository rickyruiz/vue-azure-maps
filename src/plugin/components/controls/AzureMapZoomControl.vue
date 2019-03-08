<script lang="ts">
import { atlas } from 'types'
import { ControlPosition } from 'azure-maps-control'
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
    position: {
      type: String as Prop<ControlPosition>,
      default: ControlPosition.BottomRight,
    },
  },

  render(createElement, context) {
    //@ts-ignore Azure Maps Control types are incorrect, it declares 'controls' instead of 'control'
    // Construct a zoom control
    const zoomControl: atlas.controls.ZoomControl = new context.parent.$_azureMaps.atlas.control.ZoomControl()

    return createElement(AzureMapControl, {
      props: {
        control: zoomControl,
        options: context.props,
      },
    })
  },
})
</script>
