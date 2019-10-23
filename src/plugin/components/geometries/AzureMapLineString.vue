<script lang="ts">
import { getDataSourceInjection } from '@/plugin/utils/dependency-injection'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'

enum AzureMapLineStringEvents {
  Error = 'error',
}

const state = Vue.observable({ id: 0 })

/**
 * A LineString represents a geographic curve.
 */
export default Vue.extend({
  name: 'AzureMapLineString',

  /**
   * Inject the `getDataSource` function to get the `atlas.source.DataSource` instance
   */
  inject: ['getDataSource'],

  props: {
    id: {
      type: String,
      default: '',
    },

    coordinates: {
      type: Array as Prop<atlas.data.Position[] | null>,
      default: null,
    },

    properties: {
      type: Object,
      default: () => ({}),
    },
  },

  async created() {
    await this.validateProps()

    // Look for the injected function that retreives the data source instance
    const getDataSource = getDataSourceInjection(this)

    if (!getDataSource) return

    // Retrieve the data source from the injected function
    const dataSource = getDataSource()

    // Create a shape from the line string geometry
    const shape = new this.$_azureMaps.atlas.Shape(
      new this.$_azureMaps.atlas.data.LineString(this.coordinates || []),
      this.id || `azure-map-line-string-${state.id++}`,
      this.properties
    )

    // Add the shape to the data source.
    dataSource.add([shape])

    // Watch the shape position and update it every time it changes
    this.$watch(
      'coordinates',
      (newCoordinates: atlas.data.Position[] | null) => {
        this.validateCoordinates(newCoordinates).then(coords => {
          shape.setCoordinates(coords)
        })
      },
      {
        deep: true,
      }
    )

    // Remove the shape when the component is destroyed
    this.$once('hook:destroyed', () => {
      dataSource.remove(shape)
    })
  },

  methods: {
    // Perform more complex prop validations than is possible
    // inside individual validator functions for each prop.
    async validateProps(): Promise<void> {
      await this.validateCoordinates(this.coordinates)
    },

    async validateCoordinates(
      coordinates: atlas.data.Position[] | null
    ): Promise<atlas.data.Position[]> {
      try {
        // Check for invalid coordinates
        if (!coordinates) {
          throw new Error(
            `Invalid <AzureMapLineString> coordinates, coordinates are ${coordinates}.\nPlease make sure <AzureMapLineString> coordinates are valid.`
          )
        }
        return Promise.resolve(coordinates || [])
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(error)
        }
        this.$emit(AzureMapLineStringEvents.Error, error)
        return Promise.reject(error)
      }
    },
  },

  render(createElement) {
    return createElement()
  },
})
</script>

