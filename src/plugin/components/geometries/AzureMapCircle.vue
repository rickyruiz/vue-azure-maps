<script lang="ts">
import Vue from 'vue'
import AzureMapPoint from './AzureMapPoint.vue'

/**
 * A Point with a circle subtype.
 */
export default Vue.extend({
  name: 'AzureMapCircle',

  functional: true,

  props: {
    /**
     * The circle radius
     */
    radius: {
      type: Number,
      default: 0,
    },
  },

  render(createElement, context) {
    const defaultProperties = {
      subType: 'Circle',
      radius: context.props.radius,
    }

    if (!context.data.attrs) {
      context.data.attrs = {}
    }

    context.data.attrs.properties = context.data.attrs.properties
      ? {
          ...context.data.attrs.properties,
          ...defaultProperties,
        }
      : defaultProperties

    return createElement(AzureMapPoint, context.data, context.children)
  },
})
</script>
