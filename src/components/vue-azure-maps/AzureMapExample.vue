<template>
  <AzureMap
    :center="mapOptions.center"
    class="azure-map"
  >
    <!-- Azure Map controls -->
    <AzureMapZoomControl/>
    <AzureMapPitchControl/>
    <AzureMapCompassControl/>
    <AzureMapStyleControl/>

    <!-- Add an Html marker -->
    <AzureMapHtmlMarker
      :position="htmlMarkerOptions.position"
    />

    <!-- Show user position with an optional accuracy circle -->
    <AzureMapUserPosition
      :symbol-layer-options="userPosition.symbolLayerOptions"
      :center-map-to-user-position="false"
      :camera-options="userPosition.cameraOptions"
      :show-accuracy="true"
      :enable-high-accuracy="true"
      :polygon-layer-options="userPosition.polygonLayerOptions"
    />

    <!-- Create a Data Source -->
    <AzureMapDataSource>
      <!-- Add Points to the Data Source -->
      <AzureMapPoint
        v-for="point in points"
        :key="point.name"
        :longitude="point.longitude"
        :latitude="point.latitude"
      />
      <!-- Add a Symbol Layer to render the Points stored in the Data Source -->
      <AzureMapSymbolLayer
        :options="symbolLayerOptions"
      />
    </AzureMapDataSource>

    <!-- Create a Data Source -->
    <AzureMapDataSource>
      <!-- Add Line Strings to the Data Source -->
      <AzureMapLineString
        v-for="lineString in lineStrings"
        :key="lineString.name"
        :coordinates="lineString.coordinates"
      />
      <!-- Add a Line Layer to render the Line Strings stored in the Data Source -->
      <AzureMapLineLayer
        :options="lineLayerOptions"
      />
    </AzureMapDataSource>

    <!-- Create a Data Source -->
    <AzureMapDataSource>
      <!-- Add Polygons to the Data Source -->
      <AzureMapPolygon
        v-for="polygon in polygons"
        :key="polygon.name"
        :coordinates="polygon.coordinates"
      />
      <!-- Add a Polygon Layer to render the Polygons stored in the Data Source -->
      <AzureMapPolygonLayer
        :options="polygonLayerOptions"
      />
    </AzureMapDataSource>
  </AzureMap>
</template>

<script lang="ts">
import {
  AzureMap,
  AzureMapDataSource,
  AzureMapHtmlMarker,
  AzureMapUserPosition,
  AzureMapPoint,
  AzureMapLineString,
  AzureMapPolygon,
  AzureMapZoomControl,
  AzureMapPitchControl,
  AzureMapStyleControl,
  AzureMapCompassControl,
  AzureMapSymbolLayer,
  AzureMapLineLayer,
  AzureMapPolygonLayer,
} from '@/plugin'
import { atlas } from 'types'
import Vue from 'vue'

type MapOptions = atlas.ServiceOptions &
  atlas.CameraOptions &
  atlas.StyleOptions &
  atlas.UserInteractionOptions

export default Vue.extend({
  name: 'AzureMapExample',

  components: {
    AzureMap,
    AzureMapDataSource,
    AzureMapHtmlMarker,
    AzureMapUserPosition,
    AzureMapPoint,
    AzureMapLineString,
    AzureMapPolygon,
    AzureMapZoomControl,
    AzureMapPitchControl,
    AzureMapStyleControl,
    AzureMapCompassControl,
    AzureMapSymbolLayer,
    AzureMapLineLayer,
    AzureMapPolygonLayer,
  },

  data() {
    return {
      mapOptions: {
        center: [-122.33, 47.6],
      } as MapOptions,

      htmlMarkerOptions: {
        position: [-122.33, 47.6],
      } as atlas.HtmlMarkerOptions,

      userPosition: {
        symbolLayerOptions: {
          iconOptions: {
            image: 'pin-blue',
          },
        } as atlas.SymbolLayerOptions,
        cameraOptions: {
          zoom: 15,
        } as atlas.CameraOptions,

        polygonLayerOptions: {
          fillColor: 'green',
          opacity: 0.5,
        } as atlas.PolygonLayerOptions,
      },

      symbolLayerOptions: {
        iconOptions: {
          image: 'pin-red',
        },
      } as atlas.SymbolLayerOptions,

      lineLayerOptions: {
        strokeColor: '#41B883',
        strokeWidth: 1,
      } as atlas.LineLayerOptions,

      polygonLayerOptions: {
        fillColor: 'rgba(0, 200, 200, 0.8)',
      } as atlas.PolygonLayerOptions,

      points: [] as {
        name: string
        longitude: number
        latitude: number
      }[],
      mockPointSize: 100,

      lineStrings: [] as {
        name: string
        coordinates: atlas.data.Position[]
      }[],
      mockLineStringSize: 20,

      polygons: [] as {
        name: string
        coordinates: atlas.data.Position[]
      }[],
      mockPolygonSize: 2,
    }
  },

  mounted() {
    this.generateMockPoints()
    this.generateMockLineStrings()
    this.generateMockPolygons()
  },

  methods: {
    generateMockPoints(): void {
      //Generate a bunch of points with random coordinates
      for (let i = 0; i < this.mockPointSize; i++) {
        this.points.push({
          name: `Point-${i}`,
          longitude: this.generateRandomLongitude(),
          latitude: this.generateRandomLatitude(),
        })
      }
    },

    generateMockLineStrings(): void {
      //Generate a bunch of line strings with random coordinates
      for (let i = 0; i < this.mockLineStringSize; i++) {
        this.lineStrings.push({
          name: `LineString-${i}`,
          coordinates: [
            [this.generateRandomLongitude(), this.generateRandomLatitude()],
            [this.generateRandomLongitude(), this.generateRandomLatitude()],
          ],
        })
      }
    },

    generateMockPolygons(): void {
      //Generate a bunch of line strings with random coordinates
      for (let i = 0; i < this.mockPolygonSize; i++) {
        this.polygons.push({
          name: `Polygon-${i}`,
          coordinates: [
            [this.generateRandomLongitude(), this.generateRandomLatitude()],
            [this.generateRandomLongitude(), this.generateRandomLatitude()],
            [this.generateRandomLongitude(), this.generateRandomLatitude()],
            [this.generateRandomLongitude(), this.generateRandomLatitude()],
            [this.generateRandomLongitude(), this.generateRandomLatitude()],
          ],
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
.azure-map {
  width: 100%;
  height: 100%;
}
</style>
