//===
// Components
//===
import AzureMap from '@/plugin/components/AzureMap.vue'
import AzureMapDataSource from '@/plugin/components/AzureMapDataSource.vue'
import AzureMapHtmlMarker from '@/plugin/components/AzureMapHtmlMarker.vue'

//===
// Custom components
//===
import AzureMapUserPosition from '@/plugin/components/AzureMapUserPosition.vue'

//===
// Control components
//===
import AzureMapControl from '@/plugin/components/controls/AzureMapControl.vue'
import AzureMapZoomControl from '@/plugin/components/controls/AzureMapZoomControl.vue'
import AzureMapPitchControl from '@/plugin/components/controls/AzureMapPitchControl.vue'
import AzureMapStyleControl from '@/plugin/components/controls/AzureMapStyleControl.vue'
import AzureMapCompassControl from '@/plugin/components/controls/AzureMapCompassControl.vue'

//===
// Layer components
//===
import AzureMapSymbolLayer from '@/plugin/components/layers/AzureMapSymbolLayer.vue'
import AzureMapPolygonLayer from '@/plugin/components/layers/AzureMapPolygonLayer.vue'
import AzureMapLineLayer from '@/plugin/components/layers/AzureMapLineLayer.vue'
import AzureMapHeatMapLayer from '@/plugin/components/layers/AzureMapHeatMapLayer.vue'
import AzureMapImageLayer from '@/plugin/components/layers/AzureMapImageLayer.vue'
import AzureMapTileLayer from '@/plugin/components/layers/AzureMapTileLayer.vue'

//===
// Geometry components
//===
import AzureMapPoint from '@/plugin/components/geometries/AzureMapPoint.vue'
import AzureMapCircle from '@/plugin/components/geometries/AzureMapCircle.vue'
import AzureMapLineString from '@/plugin/components/geometries/AzureMapLineString.vue'
import AzureMapPolygon from '@/plugin/components/geometries/AzureMapPolygon.vue'

import atlas from 'azure-maps-control'
import './vue'
import { VueAzureMaps } from './vue-azure-maps'

export default VueAzureMaps

export { VueAzureMapsPluginOptions } from './vue-azure-maps'

export {
  atlas,
  AzureMap,
  AzureMapDataSource,
  AzureMapHtmlMarker,
  AzureMapUserPosition,
  AzureMapPoint,
  AzureMapCircle,
  AzureMapLineString,
  AzureMapPolygon,
  AzureMapControl,
  AzureMapZoomControl,
  AzureMapPitchControl,
  AzureMapStyleControl,
  AzureMapCompassControl,
  AzureMapSymbolLayer,
  AzureMapPolygonLayer,
  AzureMapLineLayer,
  AzureMapHeatMapLayer,
  AzureMapImageLayer,
  AzureMapTileLayer,
}
