import { VueAzureMapsPluginOptions, atlas } from 'types'
import { PluginFunction, VueConstructor } from 'vue'
import { install, VueWithPlugin } from './install'
import { inBrowser } from './utils/dom'
import { assert } from './utils/warn'

export default class VueAzureMaps {
  options: VueAzureMapsPluginOptions

  constructor(lib: typeof atlas, options?: VueAzureMapsPluginOptions) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here.
    if (!VueWithPlugin && inBrowser && window.Vue) {
      VueAzureMaps.install(
        (window as typeof window & { Vue: VueConstructor<Vue> }).Vue
      )
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(
        VueWithPlugin,
        `must call Vue.use(VueAzureMaps) before using Azure Maps components.`
      )
      assert(
        typeof Promise !== 'undefined',
        `vue-azure-maps requires a Promise polyfill in this browser.`
      )
      assert(
        this instanceof VueAzureMaps,
        `VueAzureMaps must be called with the new operator.`
      )
    }

    if (!options) options = { key: '' }
    this.options = options
    this.key = options.key
    this.atlas = lib
    this.setSubscriptionKey(options.key)
  }

  public readonly key: string
  public readonly atlas: typeof atlas

  public setSubscriptionKey(key: string) {
    // Set the Azure Maps subscription key to the map SDK.
    this.atlas.setSubscriptionKey(key)
  }

  static install: PluginFunction<VueAzureMapsPluginOptions> = install
  static version = process.env.VUE_AZURE_MAPS_VERSION
}
