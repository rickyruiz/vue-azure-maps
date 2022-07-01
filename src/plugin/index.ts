import 'azure-maps-control/dist/atlas.min.css'
import VueAzureMaps from './vue-azure-maps'

//===
// Components
//===
import AzureMap from './components/AzureMap.vue'
import AzureMapDataSource from './components/AzureMapDataSource.vue'
import AzureMapIndoor from './components/AzureMapIndoor.vue'
import AzureMapHtmlMarker from './components/AzureMapHtmlMarker.vue'
import AzureMapPopup from './components/AzureMapPopup.vue'

//===
// Custom components
//===
import AzureMapUserPosition from './components/AzureMapUserPosition.vue'
import AzureMapImageSpriteIcon from './components/AzureMapImageSpriteIcon.vue'
import AzureMapSpiderClusterManager from './components/AzureMapSpiderClusterManager.vue'
import AzureMapFullscreenControl from './components/controls/AzureMapFullscreenControl.vue'
import AzureMapGeolocationControl from './components/controls/AzureMapGeolocationControl.vue'

//===
// Control components
//===
import AzureMapControl from './components/controls/AzureMapControl.vue'
import AzureMapZoomControl from './components/controls/AzureMapZoomControl.vue'
import AzureMapPitchControl from './components/controls/AzureMapPitchControl.vue'
import AzureMapStyleControl from './components/controls/AzureMapStyleControl.vue'
import AzureMapCompassControl from './components/controls/AzureMapCompassControl.vue'

//===
// Layer components
//===
import AzureMapSymbolLayer from './components/layers/AzureMapSymbolLayer.vue'
import AzureMapPolygonLayer from './components/layers/AzureMapPolygonLayer.vue'
import AzureMapLineLayer from './components/layers/AzureMapLineLayer.vue'
import AzureMapHeatMapLayer from './components/layers/AzureMapHeatMapLayer.vue'
import AzureMapImageLayer from './components/layers/AzureMapImageLayer.vue'
import AzureMapTileLayer from './components/layers/AzureMapTileLayer.vue'
import AzureMapBubbleLayer from './components/layers/AzureMapBubbleLayer.vue'

//===
// Geometry components
//===
import AzureMapPoint from './components/geometries/AzureMapPoint.vue'
import AzureMapCircle from './components/geometries/AzureMapCircle.vue'
import AzureMapLineString from './components/geometries/AzureMapLineString.vue'
import AzureMapPolygon from './components/geometries/AzureMapPolygon.vue'

export {
  AzureMap,
  AzureMapDataSource,
  AzureMapIndoor,
  AzureMapHtmlMarker,
  AzureMapPopup,
  AzureMapUserPosition,
  AzureMapImageSpriteIcon,
  AzureMapSpiderClusterManager,
  AzureMapPoint,
  AzureMapCircle,
  AzureMapLineString,
  AzureMapPolygon,
  AzureMapControl,
  AzureMapZoomControl,
  AzureMapPitchControl,
  AzureMapStyleControl,
  AzureMapCompassControl,
  AzureMapFullscreenControl,
  AzureMapGeolocationControl,
  AzureMapSymbolLayer,
  AzureMapPolygonLayer,
  AzureMapLineLayer,
  AzureMapHeatMapLayer,
  AzureMapImageLayer,
  AzureMapTileLayer,
  AzureMapBubbleLayer,
}

export default VueAzureMaps
