<script lang="ts">
import { atlas, AzureMapPoint } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'

enum AzureMapPointEvent {
  GeometryCreated = 'geometry-created',
  ShapeCreated = 'shape-created',
  ShapeAdded = 'shape-added',
  CircleCoordinates = 'circle-coordinates',
  Error = 'error',
}

const state = Vue.observable({ id: 0 })

/**
 * A Point that represents a geographic position.
 */
export default Vue.extend({
  name: 'AzureMapPoint',

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
      type: Array as Prop<atlas.data.Position | null>,
      default: null,
    },

    longitude: {
      type: Number as Prop<number | null>,
      default: null,
    },

    latitude: {
      type: Number as Prop<number | null>,
      default: null,
    },

    properties: {
      type: Object as Prop<Record<string, any>>,
      default: () => ({}),
    },
  },

  computed: {
    pointCoordinates(): atlas.data.Position | null {
      // If coordinates are not provided,
      // look for individual props
      if (!this.coordinates) {
        // If individual props are not provided,
        // return null
        if (!this.longitude || !this.latitude) {
          return null
        }
        // return individual props
        return [this.longitude, this.latitude]
      }
      // return position
      return this.coordinates
    },

    pointProperties(): Record<string, any> {
      // Create a computed property to keep track of object changes in a watcher
      return { ...(this.properties || {}) }
    },
  },

  async created() {
    await this.validateProps()

    //@ts-ignore There is no TypeScript support for injections without decorators
    // Look for the function that retreives the data source instance
    const {
      getDataSource,
    }: { getDataSource: () => atlas.source.DataSource } = this

    if (!getDataSource) {
      if (process.env.NODE_ENV === 'production') return
      // If the function that retreives the data source is not available,
      // warn the user that is not a descendant of an ancestor component that provides the method
      return console.warn(
        `Invalid <AzureMapPoint> data source.\nPlease make sure <AzureMapPoint> is a descendant of an <AzureMapDataSource> component.`
      )
    }

    // Retrieve the data source from the injected function
    const dataSource = getDataSource()

    // Create a point geometry
    const point = new this.$_azureMaps.atlas.data.Point(
      this.pointCoordinates || []
    )

    this.$emit(AzureMapPointEvent.GeometryCreated, point)

    // Create a shape from the point geometry
    const shape = new this.$_azureMaps.atlas.Shape(
      point,
      this.id || `azure-map-point-${state.id++}`,
      this.properties
    )

    this.$emit(AzureMapPointEvent.ShapeCreated, shape)

    // If the point has a circle polygon,
    // emit the coordinates of the circle
    if (shape.isCircle) {
      this.emitCircleCoordinates(shape)
    }

    // Add the shape to the data source.
    dataSource.add(shape)

    // Watch the shape position and update it every time it changes
    this.$watch(
      'pointCoordinates',
      (newCoordinates: atlas.data.Position | null) => {
        this.validateCoordinates(newCoordinates).then(coords => {
          shape.setCoordinates(coords)
        })
      }
    )

    this.$watch(
      'pointProperties',
      (newVal: Record<string, any>, oldVal: Record<string, any>) => {
        if (!newVal) return

        let newValEntries = Object.entries(newVal)
        let oldValEntries = Object.entries(oldVal)

        for (let [prop, val] of newValEntries) {
          // Prevent updating values that did not change
          if (val !== oldVal[prop]) {
            // Add or update the shape property value
            shape.addProperty(prop, val)

            // Look for props that can generate or update circle coordinates
            if (
              (prop === 'radius' || (prop === 'subType' && val === 'Circle')) &&
              shape.isCircle
            ) {
              this.emitCircleCoordinates(shape)
            }
          }
        }
      },
      { deep: true }
    )

    // Remove the shape when the component is destroyed
    this.$once('hook:destroyed', () => {
      dataSource.remove(shape)
    })
  },

  methods: {
    emitCircleCoordinates(shape: atlas.Shape): void {
      // If the point has a circle polygon,
      // emit the coordinates of the circle
      const { circlePolygon } = shape as atlas.Shape & {
        circlePolygon: atlas.data.Feature<atlas.data.Polygon, any>
      }
      this.$emit(
        AzureMapPointEvent.CircleCoordinates,
        circlePolygon ? circlePolygon.geometry.coordinates : null
      )
    },

    // Perform more complex prop validations than is possible
    // inside individual validator functions for each prop.
    async validateProps(): Promise<void> {
      await this.validateCoordinates(this.pointCoordinates)
    },

    async validateCoordinates(
      coordinates: atlas.data.Position | null
    ): Promise<atlas.data.Position> {
      try {
        // Check for invalid coordinates
        if (!coordinates) {
          throw new Error(
            `Invalid <AzureMapPoint> coordinates, coordinates are ${coordinates}.\nPlease make sure <AzureMapPoint> coordinates are valid.`
          )
        }

        const [longitude, latitude] = coordinates

        // Check for invalid longitude
        if (!longitude) {
          throw new Error(
            `Invalid <AzureMapPoint> longitude, longitude is ${longitude}.\nPlease provide a valid number using longitude or coordinates ([<<longitude>>, latitude]).`
          )
        }

        // Check for invalid latitude
        if (!latitude) {
          throw new Error(
            `Invalid <AzureMapPoint> latitude, latitude is ${latitude}.\nPlease provide a valid number using latitude or coordinates ([longitude, <<latitude>>]).`
          )
        }

        return Promise.resolve(coordinates || [])
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(error)
        }
        this.$emit(AzureMapPointEvent.Error, error)
        return Promise.reject(error)
      }
    },
  },

  render(createElement) {
    return createElement()
  },
})
</script>

