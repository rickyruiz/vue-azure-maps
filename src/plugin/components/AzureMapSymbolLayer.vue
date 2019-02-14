<template>
  <span
    style="{ display: 'none' }"
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

export default Vue.extend({
  name: 'AzureMapSymbolLayer',

  props: {
    map: {
      type: Object as () => atlas.Map,
      default: null,
      required: true,
    },
  },

  data() {
    return {
      dataSource: null as atlas.source.DataSource | null,
    }
  },

  mounted() {
    // Create a data source to manage shapes
    this.dataSource = new this.$_azureMaps.atlas.source.DataSource()

    // Add the data source to the map sources
    this.map.sources.add(this.dataSource)

    // Create a symbol layer from the recently created data source
    const symbolLayer = new this.$_azureMaps.atlas.layer.SymbolLayer(
      this.dataSource
    )

    // Add the symbol layer with the data source to the map layers
    this.map.layers.add(symbolLayer)
  },
})
</script>
