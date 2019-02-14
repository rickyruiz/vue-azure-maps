import { atlas } from 'azure-maps-control'
import { PluginFunction } from 'vue'

export declare class VueAzureMaps {
  constructor(options: VueAzureMapsPluginOptions, lib: typeof atlas)

  public readonly key: string
  public readonly atlas: typeof atlas

  static install: PluginFunction<VueAzureMapsPluginOptions>
  static version: string
}

export interface VueAzureMapsPluginOptions {
  key: string
}
