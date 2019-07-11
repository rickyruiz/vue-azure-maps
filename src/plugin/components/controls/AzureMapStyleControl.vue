<script lang="ts">
import { atlas } from 'types'
import { ControlPosition, ControlStyle } from 'azure-maps-control'
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
     * The style of the control.
     * Default `ControlStyle.light`
     * @default ControlStyle.light
     */
    style: {
      type: String as Prop<ControlStyle>,
      default: ControlStyle.light,
    },

    /**
     * The map styles to show in the control.
     * Style names are case sensitive.
     * If an included style isn't supported by the map it will be ignored.
     * Available styles can be found in the
     * [supported styles]{@link https://docs.microsoft.com/en-us/azure/azure-maps/supported-map-styles} article.
     * If "all" is specified, all map styles will be shown.
     * Default `["road", "grayscale_light", "grayscale_dark", "night", "road_shaded_relief"]`
     * @default ["road", "grayscale_light", "grayscale_dark", "night", "road_shaded_relief"]
     */
    mapStyles: {
      type: [Array, String] as Prop<string[] | 'all'>[],
      default: () => [
        'road',
        'grayscale_light',
        'grayscale_dark',
        'night',
        'road_shaded_relief',
      ],
    },
  },

  render(createElement, context) {
    // Construct a compass control
    return createElement(AzureMapControl, {
      props: {
        control: new context.parent.$_azureMaps.atlas.control.StyleControl({
          style: context.props.style,
          mapStyles: context.props.mapStyles,
        }),
        options: {
          position: context.props.position,
        } as atlas.ControlOptions,
      },
    })
  },
})
</script>
