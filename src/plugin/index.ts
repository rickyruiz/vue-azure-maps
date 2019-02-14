import 'azure-maps-control/dist/css/atlas.min.css'
import { VueAzureMapsPluginOptions } from 'types'
import { PluginFunction, PluginObject } from 'vue'
import { install } from './install'
import _vueAzureMaps from './vue-azure-maps'
import AzureMapControl from './components/AzureMapControl.vue'
import AzureMapSymbolLayer from './components/AzureMapSymbolLayer.vue'
import AzureMapShape from './components/AzureMapShape.vue'

_vueAzureMaps.install = install as PluginFunction<VueAzureMapsPluginOptions>
_vueAzureMaps.version = '__VERSION__'

const VueAzureMaps: PluginObject<VueAzureMapsPluginOptions> = {
  install: _vueAzureMaps.install,
  name: 'vue-azure-maps',
}

if (typeof window !== 'undefined' && (window as any).Vue)
  (window as any).Vue.use(VueAzureMaps)

export { AzureMapControl, AzureMapSymbolLayer, AzureMapShape }

export default VueAzureMaps
