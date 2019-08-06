<template>
  <AzureMapDataSource
    v-if="hasPosition"
  >
    <AzureMapCircle
      v-if="showAccuracy && radius"
      :longitude="longitude"
      :latitude="latitude"
      :radius="radius"
      @[circleEventName]="$emit(circleEventName, $event)"
    />
    <AzureMapPoint
      :longitude="longitude"
      :latitude="latitude"
    />
    <AzureMapPolygonLayer
      v-if="showAccuracy"
      :options="polygonLayerOptions || undefined"
    />
    <AzureMapSymbolLayer
      :options="userPositionSymbolLayerOptions"
    />
  </AzureMapDataSource>
</template>

<script lang="ts">
import { getOptionsFromProps } from '@/plugin/utils'
import { atlas } from 'types'
import Vue from 'vue'
import { Prop } from 'vue/types/options'

enum AzureMapUserPositionEvent {
  Success = 'success',
  Error = 'error',
  PermissionDenied = 'permission-denied',
  PositionUnavailable = 'permission-unavailable',
  Timeout = 'timeout',
  UnknownError = 'unknown-error',
  Ready = 'ready',
}

export default Vue.extend({
  name: 'AzureMapUserPosition',

  /**
   * Inject the `getMap` function to get the `atlas.Map` instance
   */
  inject: ['getMap'],

  components: {
    AzureMapDataSource: () =>
      import(
        /* webpackChunkName: 'azure-map-data-source' */ '@/plugin/components/AzureMapDataSource.vue'
      ),
    AzureMapCircle: () =>
      import(
        /* webpackChunkName: 'azure-map-circle' */ '@/plugin/components/geometries/AzureMapCircle.vue'
      ),
    AzureMapPoint: () =>
      import(
        /* webpackChunkName: 'azure-map-point' */ '@/plugin/components/geometries/AzureMapPoint.vue'
      ),
    AzureMapPolygonLayer: () =>
      import(
        /* webpackChunkName: 'azure-map-polygon-layer' */ '@/plugin/components/layers/AzureMapPolygonLayer.vue'
      ),
    AzureMapSymbolLayer: () =>
      import(
        /* webpackChunkName: 'azure-map-symbol-layer' */ '@/plugin/components/layers/AzureMapSymbolLayer.vue'
      ),
  },

  props: {
    /**
     * Indicates the application would like to receive the best possible results.
     * If true and if the device is able to provide a more accurate position, it will do so.
     */
    enableHighAccuracy: {
      type: Boolean,
      default: false,
    },

    /**
     * integer (milliseconds]) | infinity - maximum cached position age.
     */
    maximumAge: {
      type: Number,
      default: null,
    },

    /**
     * integer (milliseconds]) - amount of time before the error callback is invoked, if 0 it will never invoke.
     */
    timeout: {
      type: Number,
      default: null,
    },

    /**
     * Flag that controls if an accuracy circle polygon will be shown
     */
    showAccuracy: {
      type: Boolean,
      default: false,
    },

    /**
     * Override the user position accuracy used for the circle polygon radius
     */
    accuracy: {
      type: Number,
      default: null,
    },

    /**
     * Flag that controls if the map will center on the users position
     */
    centerMapToUserPosition: {
      type: Boolean,
      default: false,
    },

    /**
     * If `centerMapToUserPosition` is true, this options are passed to the `map.setCamera` method
     */
    cameraOptions: {
      type: Object as Prop<
        | null
        | atlas.CameraOptions & atlas.AnimationOptions
        | atlas.CameraBoundsOptions & atlas.AnimationOptions
      >,
      default: null,
    },

    /**
     * The symbol layer options for the user position point
     */
    symbolLayerOptions: {
      type: Object as Prop<null | atlas.SymbolLayerOptions>,
      default: null,
    },

    /**
     * The polygon layer options for the accuracy circle polygon
     */
    polygonLayerOptions: {
      type: Object as Prop<null | atlas.PolygonLayerOptions>,
      default: null,
    },
  },

  data() {
    return {
      longitude: null as number | null,
      latitude: null as number | null,
      radius: null as Number | null,
      defaultSymbolLayerOptions: {
        filter: [
          'any',
          ['==', ['geometry-type'], 'Point'],
          ['==', ['geometry-type'], 'MultiPoint'],
        ], // Only render Point or MultiPoints in this layer.
      },
      hasPosition: false,
      error: null as PositionError | null,
    }
  },

  computed: {
    circleEventName(): string | null {
      return this.showAccuracy ? 'circle-coordinates' : null
    },

    userPositionSymbolLayerOptions(): Record<string, any> {
      return {
        ...(this.symbolLayerOptions || {}),
        ...this.defaultSymbolLayerOptions,
      }
    },
  },

  created() {
    const { enableHighAccuracy, maximumAge, timeout } = this

    navigator.geolocation.getCurrentPosition(
      position => {
        // Clear any error
        this.error = null
        this.$emit(AzureMapUserPositionEvent.Success, position)

        // @ts-ignore There is no TypeScript support for injections without decorators
        // Look for the function that retreives the map instance
        const { getMap }: { getMap: () => atlas.Map } = this

        if (!getMap) {
          if (process.env.NODE_ENV === 'production') return
          // If the function that retreives the map instance is not available,
          // warn the user that is not a descendant of an ancestor component that provides the method
          return console.warn(
            `Invalid <AzureMapControl> map instance.\nPlease make sure <AzureMapControl> is a descendant of <AzureMap>.`
          )
        }

        // Retrieve the map instance from the injected function
        const map = getMap()

        const { longitude, latitude, accuracy } = position.coords

        this.longitude = longitude

        this.latitude = latitude

        if (this.showAccuracy) {
          // Create accuracy circle polygon
          this.radius = this.accuracy || accuracy
        }

        this.hasPosition = true

        if (this.centerMapToUserPosition) {
          // Center the map on the users position.
          map.setCamera({
            ...(this.cameraOptions || {}),
            center: [this.longitude, this.latitude],
          })
        }

        this.$emit(AzureMapUserPositionEvent.Ready)
      },
      error => {
        // If an error occurs when trying to access the users position information, emit it with an error message.
        this.hasPosition = false
        this.error = error

        let errorEvent: AzureMapUserPositionEvent
        let errorMessage: string

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorEvent = AzureMapUserPositionEvent.PermissionDenied
            errorMessage = 'User denied the request for Geolocation.'
            break
          case error.POSITION_UNAVAILABLE:
            errorEvent = AzureMapUserPositionEvent.PositionUnavailable
            errorMessage = 'Position information is unavailable.'
            break
          case error.TIMEOUT:
            errorEvent = AzureMapUserPositionEvent.Timeout
            errorMessage = 'The request to get user position timed out.'
            break
          default:
            errorEvent = AzureMapUserPositionEvent.UnknownError
            errorMessage = 'An unknown error occurred.'
            break
        }

        this.$emit(errorEvent, errorMessage)
        this.$emit(AzureMapUserPositionEvent.Error)
      },
      this.getOptionsFromProps<PositionOptions>({
        enableHighAccuracy,
        maximumAge,
        timeout,
      })
    )
  },

  methods: {
    getOptionsFromProps,
  },
})
</script>
