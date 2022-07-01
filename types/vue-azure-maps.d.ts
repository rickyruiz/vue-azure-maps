// import atlas from 'azure-maps-control'
import atlas from 'azure-maps-indoor'
import { PluginFunction } from 'vue'

export declare class VueAzureMaps {
  constructor(lib: typeof atlas, options?: VueAzureMapsPluginOptions)

  public readonly key: string
  public readonly atlas: typeof atlas

  public setSubscriptionKey: (key: string) => void

  static install: PluginFunction<VueAzureMapsPluginOptions>
  static version: string
}

export interface VueAzureMapsPluginOptions {
  key: string
}
