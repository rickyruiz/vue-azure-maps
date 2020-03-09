import * as atlasJs from 'azure-maps-control/dist/atlas.min.js'
import { VueAzureMapsPluginOptions } from 'types'
import Vue, { VueConstructor } from 'vue'
import VueAzureMaps from './vue-azure-maps'

export let VueWithPlugin: VueConstructor<Vue> | undefined

export function install(
  _Vue: VueConstructor<Vue>,
  options?: VueAzureMapsPluginOptions
): void {
  if (Vue && _Vue === VueWithPlugin) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vue-azure-maps] already installed. Vue.use(VueAzureMaps) should be called only once.'
      )
    }
    return
  }

  VueWithPlugin = _Vue

  VueWithPlugin.prototype.$_azureMaps = new VueAzureMaps(atlasJs, options)
}
