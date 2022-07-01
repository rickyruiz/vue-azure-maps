<template>
  <AzureMap
    v-if="showMap"
    :map-style.sync="mapOptions.style"
    :view.sync="mapOptions.view"
    :language.sync="mapOptions.language"
    class="AzureMap"
    :center="[-122.33, 47.6]"
    :zoom="19"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @ready="setMap"
  >
    <AzureMapIndoor
      :tileset-id="'c4184904-c641-70c7-5f46-228c623788ed'"
      :stateset-id="'34907111-4144-0cdc-43ab-763b72badec7'"
      :region="'us'"
    />
  </AzureMap>
</template>

<script lang="ts">
import { AzureMap, AzureMapIndoor } from '@/plugin'
import { atlas } from 'types'
import Vue from 'vue'

type MapOptions = atlas.ServiceOptions &
  atlas.CameraOptions &
  atlas.StyleOptions &
  atlas.UserInteractionOptions

type CustomPoint = {
  longitude: number
  latitude: number
  properties: Record<string, unknown>
}

export default Vue.extend({
  name: 'AzureIndoorMapExample',

  components: {
    AzureMap,
    AzureMapIndoor,
  },

  data() {
    return {
      showMap: true,

      map: null as atlas.Map | null,

      mapOptions: {
        center: [-122.33, 47.6],
        style: 'road',
        view: 'Auto',
        language: 'en-US',
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
          ignorePlacement: true,
          allowOverlap: true,
          image: 'pin-red',
        },
      } as atlas.SymbolLayerOptions,

      isCustomIconAdded: false,

      customIconSymbolLayerOptions: {
        iconOptions: {
          image: 'vue-azure-maps-logo',
          size: 0.1,
        },
      } as atlas.SymbolLayerOptions,

      bubbleLayerOptions: {
        radius: 5,
        strokeColor: '#4288f7',
        strokeWidth: 6,
        color: 'white',
      } as atlas.BubbleLayerOptions,

      lineLayerOptions: {
        strokeColor: '#41B883',
        strokeWidth: 1,
      } as atlas.LineLayerOptions,

      polygonLayerOptions: {
        fillColor: 'rgba(0, 200, 200, 0.8)',
      } as atlas.PolygonLayerOptions,

      selectedShape: null as atlas.Shape | null,

      selectedPoint: null as CustomPoint | null,

      points: [] as CustomPoint[],
      mockPointSize: 1,

      lineStrings: [] as {
        name: string
        coordinates: atlas.data.Position[]
      }[],
      mockLineStringSize: 5,

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
    setMap(e: atlas.MapEvent): void {
      // Save the map instance if needed
      this.map = e.map
    },

    getCustomPointByName(name: string): CustomPoint | undefined {
      return this.points.find((p) => p.properties.name === name)
    },

    onMouseEnter(e: atlas.MapMouseEvent): void {
      if (e.shapes && e.shapes.length > 0) {
        // Capture the selected shape.
        const selectedShape = e.shapes[0] as atlas.Shape

        // Check if the point is in our data
        const point = this.getCustomPointByName(
          selectedShape.getProperties().name
        )

        if (point) {
          // Capture the selected point.
          this.selectedPoint = point

          // Show the popup
          point.properties.isPopupOpen = true
        }
      }
    },

    onMouseLeave(): void {
      // Hide the popup
      if (this.selectedPoint) {
        this.selectedPoint.properties.isPopupOpen = false

        // Stop tracking the selected point.
        this.selectedPoint = null
      }
    },

    onMouseDown(e: atlas.MapMouseEvent): void {
      if (e.shapes && e.shapes.length > 0) {
        // Capture the selected shape.
        this.selectedShape = e.shapes[0] as atlas.Shape
        // Lock the maps ability to pan so that we can drag the symbol.
        e.map.setUserInteraction({
          dragPanInteraction: false,
        })
      }
    },

    onMouseMove(e: atlas.MapMouseEvent): void {
      // Update the position of the selected shape.
      if (this.selectedShape && e.position) {
        // Check if the point is in our data
        const point = this.getCustomPointByName(
          this.selectedShape.getProperties().name
        )

        if (point) {
          // Update the longitude and latitude
          ;[point.longitude, point.latitude] = e.position
        }
      }
    },

    onMouseUp(e: atlas.MapMouseEvent): void {
      // Stop tracking the selected shape.
      this.selectedShape = null
      // Make map panable again.
      e.map.setUserInteraction({
        dragPanInteraction: true,
      })
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
            isPopupOpen: false,
          },
        })
      }
    },

    generateMockLineStrings(): void {
      // Generate a bunch of line strings with random coordinates
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
      // Generate a bunch of polygons with random coordinates
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
.AzureMap {
  width: 100%;
  height: 100%;
}

.AzureMapPopup {
  max-width: 200px;
  padding: 1rem;
}
</style>
