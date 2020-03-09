<script lang="ts">
import {
  getMapInjection,
  getDataSourceInjection,
} from '@/plugin/utils/dependency-injection'
import bindProps from '@/plugin/utils/bind-props'
import { looseEqual } from '@/plugin/utils'
import { atlas } from 'types'
import Vue, { PropType } from 'vue'

enum AzureMapPointEvent {
  GeometryCreated = 'geometry-created',
  ShapeCreated = 'shape-created',
  ShapeAdded = 'shape-added',
  CircleCoordinates = 'circle-coordinates',
}

const state = Vue.observable({ id: 0 })

/**
 * A Point that represents a geographic position.
 */
export default Vue.extend({
  name: 'AzureMapPoint',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   * Inject the `getDataSource` function to get the `atlas.source.DataSource` instance
   */
  inject: ['getMap', 'getDataSource'],

  props: {
    id: {
      type: String,
      default: '',
    },

    coordinates: {
      type: Array as PropType<atlas.data.Position | null>,
      default: null,
    },

    longitude: {
      type: Number as PropType<number | null>,
      default: null,
    },

    latitude: {
      type: Number as PropType<number | null>,
      default: null,
    },

    properties: {
      type: Object as PropType<Record<string, unknown>>,
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

    pointProperties(): Record<string, unknown> {
      // Create a computed property to keep track of the same object reference
      return { ...(this.properties || {}) }
    },
  },

  created() {
    // Look for the injected function that retreives the map instance
    const getMap = getMapInjection(this)

    if (!getMap) return

    // Retrieve the map instance from the injected function
    const map = getMap()

    // Look for the injected function that retreives the data source instance
    const getDataSource = getDataSourceInjection(this)

    if (!getDataSource) return

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
    if (shape.isCircle()) {
      this.emitCircleCoordinates(shape)
    }

    // Add the shape to the data source.
    dataSource.add(shape)

    // Bind component props
    const unbindProps = bindProps({
      vm: this,
      map,
      props: [
        {
          propName: 'coordinates',
          target: shape,
          targetEventName: 'shapechanged',
          isSetAsObject: false,
          identity: (
            newVal: atlas.data.Position,
            oldVal: atlas.data.Position
          ) => looseEqual(newVal, oldVal),
        },
        {
          propName: 'longitude',
          target: shape,
          targetMethodName: 'coordinates',
          targetEventName: 'shapechanged',
          setter: (longitude: number) =>
            this.latitude !== null &&
            shape.setCoordinates([longitude, this.latitude]),
          isSetAsObject: false,
          retriever: (coordinates: atlas.data.Position) => coordinates[0],
        },
        {
          propName: 'latitude',
          target: shape,
          targetMethodName: 'coordinates',
          targetEventName: 'shapechanged',
          setter: (latitude: number) =>
            this.longitude !== null &&
            shape.setCoordinates([this.longitude, latitude]),
          isSetAsObject: false,
          retriever: (coordinates: atlas.data.Position) => coordinates[1],
        },
        {
          propName: 'pointProperties',
          target: shape,
          targetMethodName: 'properties',
          targetEventName: 'shapechanged',
          isSetAsObject: false,
          identity: (
            newVal: Record<string, unknown>,
            oldVal: Record<string, unknown>
          ) => looseEqual(newVal, oldVal),
          applier: (
            newValue: Record<string, unknown>,
            oldValue: Record<string, unknown>,
            set: (newValue: Record<string, unknown>) => void
          ) => {
            if (!looseEqual(newValue, oldValue)) {
              set(newValue)
            }

            if (
              shape.isCircle() &&
              (newValue.radius !== oldValue.radius ||
                newValue.subType !== oldValue.subType)
            ) {
              this.emitCircleCoordinates(shape)
            }
          },
          watchOptions: {
            deep: true,
          },
        },
      ],
    })

    // Remove the shape when the component is destroyed
    this.$once('hook:destroyed', () => {
      dataSource.remove(shape)
      unbindProps()
    })
  },

  methods: {
    emitCircleCoordinates(shape: atlas.Shape): void {
      // If the point has a circle polygon,
      // emit the coordinates of the circle
      this.$emit(
        AzureMapPointEvent.CircleCoordinates,
        shape.getCircleCoordinates()
      )
    },
  },

  render(createElement) {
    return createElement()
  },
})
</script>
