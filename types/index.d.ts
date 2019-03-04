import AzureMapControl from '@/plugin/components/AzureMapControl.vue'
import AzureMapShape from '@/plugin/components/AzureMapShape.vue'
import AzureMapSymbolLayer from '@/plugin/components/AzureMapSymbolLayer.vue'
import atlas from 'azure-maps-control'
import './vue'
import { VueAzureMaps } from './vue-azure-maps'

export default VueAzureMaps

export { VueAzureMapsPluginOptions } from './vue-azure-maps'

export { atlas, AzureMapControl, AzureMapSymbolLayer, AzureMapShape }
