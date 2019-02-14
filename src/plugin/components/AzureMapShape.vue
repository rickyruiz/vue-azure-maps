<script lang="ts">
import { atlas } from 'types'
import Vue from 'vue'

export default Vue.extend({
  name: 'AzureMapShape',

  props: {
    dataSource: {
      type: Object as () => atlas.source.DataSource,
      default: null,
      required: true,
    },

    id: {
      type: String,
      default: '',
    },

    longitude: {
      type: Number,
      default: null,
      required: true,
    },

    latitude: {
      type: Number,
      default: null,
      required: true,
    },

    properties: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      shape: null as atlas.Shape | null,
    }
  },

  computed: {
    position(): atlas.data.Position {
      return [this.longitude, this.latitude]
    },
  },

  watch: {
    longitude() {
      this.updatePosition()
    },

    latitude() {
      this.updatePosition()
    },
  },

  mounted() {
    // Create a point based on the position
    const point = new this.$_azureMaps.atlas.data.Point([
      this.longitude,
      this.latitude,
    ])

    // Create a symbol based on the point
    this.shape = new this.$_azureMaps.atlas.Shape(
      point,
      this.id || undefined,
      this.properties
    )

    // Add the symbol to the data source.
    this.dataSource.add([this.shape])
  },

  methods: {
    updatePosition(): void {
      this.shape && this.shape.setCoordinates(this.position)
    },
  },

  render(createElement, context) {
    return createElement()
  },
})
</script>
