//@ts-ignore
import * as atlasJs from 'azure-maps-control/dist/js/atlas.min.js'
import { VueAzureMapsPluginOptions } from 'types'
import _Vue from 'vue'
import VueAzureMaps from './vue-azure-maps'
export let _Vue_: typeof _Vue

export let _installed = false

export function install(
  Vue: typeof _Vue,
  options: VueAzureMapsPluginOptions
): void {
  if (_installed && _Vue === Vue) return

  _installed = true

  _Vue_ = Vue

  Vue.prototype.$_azureMaps = new VueAzureMaps(options, atlasJs)
}
