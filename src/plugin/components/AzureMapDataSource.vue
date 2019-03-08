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
import { atlas } from 'types'
import Vue from 'vue'

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

  data() {
    return {
      // The layer data source instance
      dataSource: null as atlas.source.DataSource | null,
    }
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
        `Invalid <AzureMapDataSource> map instance.\nPlease make sure <AzureMapDataSource> is a descendant of <AzureMap>.`
      )
    }

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Create a data source to manage shapes
    this.dataSource = new this.$_azureMaps.atlas.source.DataSource()

    // Add the data source to the map sources
    map.sources.add(this.dataSource)
  },

  methods: {
    getDataSource(): atlas.source.DataSource | null {
      // Return the data source for descendent components injection
      return this.dataSource
    },
  },
})
</script>
