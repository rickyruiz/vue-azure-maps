import AzureMapControl from '@/plugin/components/AzureMapControl.vue'
import AzureMapShape from '@/plugin/components/AzureMapShape.vue'
import AzureMapSymbolLayer from '@/plugin/components/AzureMapSymbolLayer.vue'
import './vue'
import { VueAzureMaps } from './vue-azure-maps'

export default VueAzureMaps

export { atlas } from 'azure-maps-control'

export { VueAzureMapsPluginOptions } from './vue-azure-maps'

export { AzureMapControl, AzureMapSymbolLayer, AzureMapShape }
