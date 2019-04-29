import { VueAzureMapsPluginOptions, atlas } from 'types'
import { PluginFunction } from 'vue'

export default class VueAzureMaps {
  options: VueAzureMapsPluginOptions

  constructor(lib: typeof atlas, options?: VueAzureMapsPluginOptions) {
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

  static install: PluginFunction<VueAzureMapsPluginOptions>
  static version: string
}
