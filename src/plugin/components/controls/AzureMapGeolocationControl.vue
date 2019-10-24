<script lang="ts">
import { GeolocationControl } from '@/plugin/modules/controls/geolocation'
import getOptionsFromProps from '@/plugin/utils/get-options-from-props'
import { atlas } from 'types'
import { ControlPosition, ControlStyle } from 'azure-maps-control'
import Vue, { PropType } from 'vue'
import AzureMapControl from './AzureMapControl.vue'

/**
 * A control that uses the browser's geolocation API to locate the user on the map.
 */
export default Vue.extend({
  name: 'AzureMapGeolocationControl',

  props: {
    /**
     * The position where the control will be placed on the map.
     */
    position: {
      type: String as PropType<atlas.ControlPosition>,
      default: ControlPosition.BottomRight,
      validator: (value: atlas.ControlPosition) =>
        Object.values(ControlPosition).includes(value),
    },

    /**
     * The style of the control. Can be; light, dark, auto, or any CSS3 color. When set to auto, the style will change based on the map style.
     * Default `ControlStyle.light'.
     * @default ControlStyle.light
     */
    controlStyle: {
      type: String as PropType<atlas.ControlStyle | string>,
      default: ControlStyle.light,
    },

    /**
     * A Geolocation API PositionOptions object.
     * Default: {enableHighAccuracy:false,timeout:6000}
     */
    positionOptions: {
      type: Object as PropType<PositionOptions | null>,
      default: null,
    },

    /**
     * Shows the users location on the map using a marker.
     * Default: true
     * */
    showUserLocation: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },

    /**
     * If true the Geolocation Control becomes a toggle button and when active the map will receive updates to the user's location as it changes.
     * Default: false
     * */
    trackUserLocation: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },

    /** The color of the user location marker.
     * Default: DodgerBlue
     * */
    markerColor: {
      type: String as PropType<string | null>,
      default: null,
    },
  },

  render(createElement) {
    // Construct a geolocation control
    return createElement(AzureMapControl, {
      props: {
        control: new GeolocationControl(
          this.$_azureMaps.atlas,
          getOptionsFromProps({
            props: this.$props,
            excludedPropKeys: ['position'],
            reservedAttributes: {
              controlStyle: 'style',
            },
          })
        ),
        options: {
          position: this.position,
        } as atlas.ControlOptions,
      },
    })
  },
})
</script>
