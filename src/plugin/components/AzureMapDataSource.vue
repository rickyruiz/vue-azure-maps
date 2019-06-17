<template>
  <span
    v-show="false"
  >
    <template
      v-if="Boolean(dataSource)"
    >
      <slot
        :data-source="dataSource"
      />
    </template>
  </span>
</template>

<script lang="ts">
import { getOptionsFromProps } from '@/plugin/utils'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'

enum AzureMapDataSourceEvent {
  Created = 'created',
}

const state = Vue.observable({ id: 0 })

/**
 * `AzureMapDataSource` makes it easy to manage shapes data that will be displayed on the map.
 *
 * A data source must be added to a layer before it is visible on the map.
 *
 * `AzureMapDataSource` may be used with:
 * `AzureMapSymbolLayer`, `AzureMapLineLayer`, `AzureMapPolygonLayer`, `AzureMapBubbleLayer`, and `AzureMapHeatMapLayer`.
 */
export default Vue.extend({
  name: 'AzureMapDataSource',

  provide(): {
    getDataSource: () => atlas.source.DataSource | null
  } {
    return {
      /**
       * Provide a function to retreive the `atlas.source.DataSource` instance for descendent components that need to inject it
       *
       * Note that this method will only be available in the descendent component if it uses `inject: ['getDataSource']`
       */
      getDataSource: this.getDataSource,
    }
  },

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  props: {
    /**
     * A unique id that the user assigns to the data source.
     * If this is not specified, then the data source will automatically be assigned an id.
     */
    id: {
      type: String as Prop<string | null>,
      default: null,
    },

    /**
     * Maximum zoom level at which to create vector tiles (higher means greater detail at high zoom levels).
     * default `18`
     * @default 18
     */
    maxZoom: {
      type: Number as Prop<number | null>,
      default: null,
    },

    /**
     * A boolean indicating if Point features in the source should be clustered or not.
     * If set to true, points will be clustered together into groups by radius.
     * default `false`
     * @default false
     */
    cluster: {
      type: Boolean as Prop<boolean | null>,
      default: null,
    },

    /**
     * The radius of each cluster in pixels.
     * default `50`
     * @default 50
     */
    clusterRadius: {
      type: Number as Prop<number | null>,
      default: null,
    },

    /**
     * The maximum zoom level in which to cluster points.
     * Defaults to one zoom less than `maxZoom` so that last zoom features are not clustered.
     */
    clusterMaxZoom: {
      type: Number as Prop<number | null>,
      default: null,
    },

    /**
     * Specifies whether to calculate line distance metrics.
     * This is required for line layers that specify `lineGradient` values.
     * default `false`
     * @default false
     */
    lineMetrics: {
      type: Boolean as Prop<boolean | null>,
      default: null,
    },

    /**
     * The Douglas-Peucker simplification tolerance that is applied to the data when rendering (higher means simpler geometries and faster performance).
     * default `0.375`
     * @default 0.375
     */
    tolerance: {
      type: Number as Prop<number | null>,
      default: null,
    },
  },

  data() {
    return {
      // The layer data source instance
      dataSource: null as atlas.source.DataSource | null,
    }
  },

  computed: {
    dataSourceOptionProps(): Record<string, any> {
      let {
        maxZoom,
        cluster,
        clusterRadius,
        clusterMaxZoom,
        lineMetrics,
        tolerance,
      } = this

      return {
        maxZoom,
        cluster,
        clusterRadius,
        clusterMaxZoom,
        lineMetrics,
        tolerance,
      }
    },
  },

  created() {
    this.initializeDataSource()
  },

  methods: {
    initializeDataSource(): void {
      //@ts-ignore There is no TypeScript support for injections without decorators
      // Look for the function that retreives the map instance
      const { getMap }: { getMap: () => atlas.Map } = this

      if (!getMap) {
        if (process.env.NODE_ENV === 'production') return
        // If the function that retreives the map instance is not available,
        // warn the user that is not a descendant of an ancestor component that provides the method
        return console.warn(
          `Invalid <AzureMapDataSource> map instance.\nPlease make sure <AzureMapDataSource> is a descendant of <AzureMap>.`
        )
      }

      // Retrieve the map instance from the injected function
      const map = getMap()

      // Get data source options from selected component props
      let options =
        this.getOptionsFromProps<atlas.DataSourceOptions>(
          this.dataSourceOptionProps
        ) || {}

      // Create a data source to manage shapes
      const dataSource = new this.$_azureMaps.atlas.source.DataSource(
        this.id || `azure-map-data-source-${state.id++}`,
        options
      )

      this.$emit(AzureMapDataSourceEvent.Created, dataSource)

      // Watch for all props changes
      this.$watch(
        () => {
          let values = ''
          for (const value of Object.values(options)) {
            values += value
          }
          return values
        },
        () => {
          let newOptions =
            this.getOptionsFromProps<atlas.DataSourceOptions>(
              this.dataSourceOptionProps
            ) || {}

          dataSource.setOptions(newOptions)
        }
      )

      // Save the data source in a data property to provide it to descendent components
      this.dataSource = dataSource

      // Add the data source to the map sources
      map.sources.add(this.dataSource)

      // Remove the data source when the component is destroyed
      this.$once('hook:destroyed', () => {
        map.sources.remove(dataSource)
      })
    },

    getDataSource(): atlas.source.DataSource | null {
      // Return the data source for descendent components injection
      return this.dataSource
    },

    getOptionsFromProps,
  },
})
</script>
