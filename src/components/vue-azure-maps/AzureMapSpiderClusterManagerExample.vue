<template>
  <AzureMap
    :center="[-122.33, 47.6]"
    class="AzureMap"
    @click="hidePopup"
    @mousestart="hidePopup"
  >
    <AzureMapZoomControl/>
    <AzureMapFullscreenControl/>
    <AzureMapPitchControl/>
    <AzureMapCompassControl/>
    <AzureMapDataSource
      :cluster="cluster"
      :cluster-radius="clusterRadius"
      :cluster-max-zoom="clusterMaxZoom"
    >
      <AzureMapPoint
        v-for="point in points"
        :key="point.properties.name"
        :longitude="point.longitude"
        :latitude="point.latitude"
        :properties="point.properties"
      />
      <AzureMapPopup
        v-model="isPopupOpen"
        :position="popupPosition"
        :pixel-offset="popupPixelOffset"
        class="AzureMapPopup"
      >
        <template
          v-if="selectedPoint"
        >
          <p>
            <strong>{{ selectedPoint.properties.name }}</strong>
          </p>
          <p>
            {{ selectedPoint.properties.description }}
          </p>
        </template>
      </AzureMapPopup>
      <AzureMapBubbleLayer
        :options="bubbleLayerOptions"
        @created="bubbleLayer = $event"
      />
      <AzureMapSymbolLayer
        :options="symbolLayerOptions"
      />
      <AzureMapSymbolLayer
        :options="shapeLayerOptions"
        @created="symbolLayer = $event"
      />
      <AzureMapSpiderClusterManager
        v-if="bubbleLayer && symbolLayer"
        :cluster-layer="bubbleLayer"
        :unclusted-layer="symbolLayer"
        @feature-selected="onFeatureSelected"
        @feature-unselected="onFeatureUnselected"
      />
    </AzureMapDataSource>
  </AzureMap>
</template>

<script lang="ts">
import {
  AzureMap,
  AzureMapZoomControl,
  AzureMapFullscreenControl,
  AzureMapPitchControl,
  AzureMapCompassControl,
  AzureMapDataSource,
  AzureMapPoint,
  AzureMapPopup,
  AzureMapBubbleLayer,
  AzureMapSymbolLayer,
  AzureMapSpiderClusterManager,
} from '@/plugin'
import { atlas } from 'types'
import Vue from 'vue'

type CustomPoint = {
  longitude: number
  latitude: number
  properties: Record<string, any>
}

export default Vue.extend({
  name: 'AzureMapSpiderClusterManagerExample',

  components: {
    AzureMap,
    AzureMapZoomControl,
    AzureMapFullscreenControl,
    AzureMapPitchControl,
    AzureMapCompassControl,
    AzureMapDataSource,
    AzureMapPoint,
    AzureMapPopup,
    AzureMapBubbleLayer,
    AzureMapSymbolLayer,
    AzureMapSpiderClusterManager,
  },

  data() {
    return {
      points: [] as CustomPoint[],
      mockPointSize: 100,

      bubbleLayer: null as atlas.layer.BubbleLayer | null,
      symbolLayer: null as atlas.layer.SymbolLayer | null,

      isPopupOpen: false,
      popupPosition: null as atlas.data.Position | null,
      popupPixelOffset: null as atlas.Pixel | null,

      selectedPoint: null as any | null,

      // Tell the data source to cluster point data.
      cluster: true,
      // The radius in pixels to cluster points together.
      clusterRadius: 45,
      // The maximium zoom level in which clustering occurs.
      // If you zoom in more than this, all points are rendered as symbols.
      clusterMaxZoom: 15,

      bubbleLayerOptions: {
        // Scale the size of the clustered bubble based on the number of points inthe cluster.
        radius: [
          'step',
          ['get', 'point_count'],
          20, // Default of 20 pixel radius.
          100,
          30, // If point_count >= 100, radius is 30 pixels.
          750,
          40, // If point_count >= 750, radius is 40 pixels.
        ],

        // Change the color of the cluster based on the value on the point_cluster property of the cluster.
        color: [
          'step',
          ['get', 'point_count'],
          'rgba(0,255,0,0.8)', // Default to green.
          100,
          'rgba(255,255,0,0.8)', // If the point_count >= 100, color is yellow.
          750,
          'rgba(255,0,0,0.8)', // If the point_count >= 100, color is red.
        ],
        strokeWidth: 0,
        blur: 0.5,
        filter: ['has', 'point_count'], // Only rendered data points which have a point_count property, which clusters do.
      } as atlas.BubbleLayerOptions,

      shapeLayerOptions: {
        filter: ['!', ['has', 'point_count']], // Filter out clustered points from this layer.
      } as atlas.SymbolLayerOptions,

      symbolLayerOptions: {
        iconOptions: {
          image: 'none', //Hide the icon image.
        },
        textOptions: {
          textField: '{point_count_abbreviated}',
          offset: [0, 0.4],
        },
      } as atlas.SymbolLayerOptions,
    }
  },

  mounted() {
    this.generateMockPoints()
  },

  methods: {
    onFeatureSelected(
      shape: atlas.Shape,
      cluster: atlas.data.Feature<atlas.data.Point, any> | null
    ): void {
      // Look for the point based on a unique key
      let currentPoint = this.points.find(
        point => point.properties.name === shape.getProperties().name
      )

      if (currentPoint) {
        this.selectedPoint = currentPoint

        if (cluster) {
          this.showPopup(cluster.geometry.coordinates, [0, 0])
        } else {
          this.showPopup(shape.getCoordinates() as atlas.data.Position, [
            0,
            -20,
          ])
        }
      }
    },

    onFeatureUnselected(e: any): void {
      this.selectedPoint = null
      this.hidePopup()
    },

    showPopup(position: atlas.data.Position, pixelOffset: atlas.Pixel): void {
      this.isPopupOpen = true
      this.popupPosition = position
      this.popupPixelOffset = pixelOffset
    },

    hidePopup(): void {
      this.isPopupOpen = false
      this.popupPosition = null
      this.popupPixelOffset = null
    },

    generateMockPoints(): void {
      // Generate a bunch of points with random coordinates
      for (let i = 0; i < this.mockPointSize; i++) {
        this.points.push({
          longitude: this.generateRandomLongitude(),
          latitude: this.generateRandomLatitude(),
          properties: {
            name: `Point-${i}`,
            description: `This is a popup for Point-${i}.`,
          },
        })
      }
    },

    generateRandomLongitude(): number {
      return Math.random() * 360 - 180
    },

    generateRandomLatitude(): number {
      return Math.random() * 170 - 85
    },
  },
})
</script>

<style scoped>
.AzureMap {
  width: 100%;
  height: 100%;
}

.AzureMapPopup {
  max-width: 200px;
  padding: 1rem;
}
</style>
