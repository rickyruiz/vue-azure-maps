<script lang="ts">
import { FullscreenControl } from '@/plugin/modules/controls/fullscreen'
import { atlas } from 'types'
import { ControlPosition, ControlStyle } from 'azure-maps-control'
import Vue from 'vue'
import { Prop } from 'vue/types/options'
import AzureMapControl from './AzureMapControl.vue'

/**
 * Fullscreen control adds the ability to toggle the map from its defined size to a fullscreen size.
 */
export default Vue.extend({
  name: 'AzureMapFullscreenControl',

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
     * The style of the control. Can be; light, dark, auto, or any CSS3 color. When set to auto, the style will change based on the map style.
     * Default `ControlStyle.light'.
     * @default ControlStyle.light
     */
    style: {
      type: String as Prop<ControlStyle | string>,
      default: ControlStyle.light,
    },

    /**
     * Specifies if the control should be hidden if fullscreen is not supported by the browser.
     * @default true
     */
    hideIfUnsupported: {
      type: Boolean,
      default: true,
    },
  },

  render(createElement, context) {
    // Construct a fullscreen control
    return createElement(AzureMapControl, {
      props: {
        control: new FullscreenControl({
          style: context.props.style,
          hideIfUnsupported: context.props.hideIfUnsupported,
        }),
        options: {
          position: context.props.position,
        } as atlas.ControlOptions,
      },
    })
  },
})
</script>
