import { VueAzureMapsPluginOptions, atlas } from 'types'
import { PluginFunction } from 'vue'

export default class VueAzureMaps {
  options: VueAzureMapsPluginOptions

  constructor(options: VueAzureMapsPluginOptions, lib: typeof atlas) {
    this.options = options
    this.key = options.key
    this.atlas = lib
  }

  public readonly key: string

  public readonly atlas: typeof atlas
  static install: PluginFunction<VueAzureMapsPluginOptions>
  static version: string
}
