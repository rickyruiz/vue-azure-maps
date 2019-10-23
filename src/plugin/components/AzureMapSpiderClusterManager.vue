<script lang="ts">
import {
  SpiderClusterManager,
  ISpiderClusterOptions,
} from '@/plugin/modules/other/spiderClusterManager'
import { getMapInjection } from '@/plugin/utils/dependency-injection'
import getOptionsFromProps from '@/plugin/utils/get-options-from-props'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'

enum AzureMapSpiderClusterManagerEvent {
  FeatureSelected = 'feature-selected',
  FeatureUnselected = 'feature-unselected',
}

export default Vue.extend({
  name: 'AzureMapSpiderClusterManager',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  props: {
    /**
     * The cluster layer instace
     */
    clusterLayer: {
      type: Object as Prop<
        atlas.layer.BubbleLayer | atlas.layer.SymbolLayer | null
      >,
      default: null,
      required: true,
    },

    /**
     * The unclusted layer instance
     */
    unclustedLayer: {
      type: Object as Prop<
        atlas.layer.BubbleLayer | atlas.layer.SymbolLayer | null
      >,
      default: null,
      required: true,
    },

    /** Minimium number of point features in cluster before switching from circle to spiral spider layout. Default: 6 */
    circleSpiralSwitchover: {
      type: Number as Prop<number | undefined>,
      default: undefined,
    },

    /** The minium pixel distance between point features and the cluster, when rendering spider layout as a circle. Default: 30 */
    minCircleLength: {
      type: Number as Prop<number | undefined>,
      default: undefined,
    },

    /** The minium angle between point features in the spiral. Default: 25 */
    minSpiralAngleSeperation: {
      type: Number as Prop<number | undefined>,
      default: undefined,
    },

    /** The maximum number of features that can be rendered in the spider layout. When the cluster is bigger than this value, it will zoom until the cluster starts to break apart. Default: 100 */
    maxFeaturesInWeb: {
      type: Number as Prop<number | undefined>,
      default: undefined,
    },

    /** A factor that is used to grow the pixel distance of each point feature from the center in the spiral. Default: 5 */
    spiralDistanceFactor: {
      type: Number as Prop<number | undefined>,
      default: undefined,
    },

    /** Layer options used to style the stick connecting the individual point feature to the cluster. */
    stickLayerOptions: {
      type: Object as Prop<atlas.LineLayerOptions | undefined>,
      default: undefined,
    },

    /** A boolean indicating if the cluster layer is visible or not. */
    visible: {
      type: Boolean as Prop<boolean | undefined>,
      default: undefined,
    },
  },

  computed: {
    spiderManagerOptionsProps(): Record<string, any> {
      let {
        circleSpiralSwitchover,
        minCircleLength,
        minSpiralAngleSeperation,
        maxFeaturesInWeb,
        spiralDistanceFactor,
        stickLayerOptions,
        visible,
      } = this

      return {
        circleSpiralSwitchover,
        minCircleLength,
        minSpiralAngleSeperation,
        maxFeaturesInWeb,
        spiralDistanceFactor,
        stickLayerOptions,
        visible,
      }
    },
  },

  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

    // Retrieve the map instance from the injected function
    const map = getMap()

    // The cluster and unclusted layer instances are required.
    if (!this.clusterLayer || !this.unclustedLayer) return

    // Get the spider manager options
    const options = getOptionsFromProps<ISpiderClusterOptions>({
      props: this.spiderManagerOptionsProps,
    })

    const spiderManager = new SpiderClusterManager(
      this.$_azureMaps.atlas,
      map,
      this.clusterLayer,
      this.unclustedLayer,
      {
        ...options,
        // Emit an event instead of using this function as a prop,
        // cannot be overwritten if props update
        featureSelected: (shape, cluster) => {
          this.$emit(
            AzureMapSpiderClusterManagerEvent.FeatureSelected,
            shape,
            cluster
          )
        },
        // Emit an event instead of using this function as a prop,
        // cannot be overwritten if props update
        featureUnselected: () => {
          this.$emit(AzureMapSpiderClusterManagerEvent.FeatureUnselected)
        },
      }
    )

    // Watch for all options props changes
    this.$watch(
      () => {
        let values = ''
        for (const value of Object.values(this.spiderManagerOptionsProps)) {
          values += value
        }
        return values
      },
      () => {
        spiderManager.setOptions(
          getOptionsFromProps({
            props: this.spiderManagerOptionsProps,
          })
        )
      }
    )

    // When the component is destroyed
    this.$once('hook:destroyed', () => {
      // Dispose the spider manager
      spiderManager.dispose()
    })
  },

  render(createElement) {
    return createElement()
  },
})
</script>
