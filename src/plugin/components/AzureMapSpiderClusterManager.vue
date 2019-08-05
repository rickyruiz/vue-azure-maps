<script lang="ts">
import {
  SpiderClusterManager,
  ISpiderClusterOptions,
} from '@/plugin/modules/other/spiderClusterManager'
import { getOptionsFromProps, addEventsFromListeners } from '@/plugin/utils'
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
      type: Object as Prop<atlas.layer.BubbleLayer | atlas.layer.SymbolLayer | null>,
      default: null,
      required: true,
    },

    /**
     * The unclusted layer instance
     */
    unclusedLayer: {
      type: Object as Prop<atlas.layer.BubbleLayer | atlas.layer.SymbolLayer | null>,
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

  mounted() {
    //@ts-ignore There is no TypeScript support for injections without decorators
    // Look for the function that retreives the map instance
    const { getMap }: { getMap: () => atlas.Map } = this

    if (!getMap) {
      if (process.env.NODE_ENV === 'production') return
      // If the function that retreives the map instance is not available,
      // warn the user that is not a descendant of an ancestor component that provides the method
      return console.warn(
        `Invalid <AzureMapSpiderClusterManager> map instance.\nPlease make sure <AzureMapSpiderClusterManager> is a descendant of <AzureMap>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // The cluster and unclusted layer instances are required.
    if (!this.clusterLayer || !this.unclusedLayer) return

    // Get the spider manager options
    const options =
      this.getOptionsFromProps<ISpiderClusterOptions>(
        this.spiderManagerOptionsProps
      ) || {}

    const spiderManager = new SpiderClusterManager(
      this.$_azureMaps.atlas,
      map,
      this.clusterLayer,
      this.unclusedLayer,
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
        let newOptions =
          this.getOptionsFromProps<ISpiderClusterOptions>(
            this.spiderManagerOptionsProps
          ) || {}

        spiderManager.setOptions(newOptions)
      }
    )

    // When the component is destroyed
    this.$once('hook:destroyed', () => {
      // Dispose the spider manager
      spiderManager.dispose()
    })
  },

  methods: {
    getOptionsFromProps,
    addEventsFromListeners,
  },

  render(createElement) {
    return createElement()
  },
})
</script>
