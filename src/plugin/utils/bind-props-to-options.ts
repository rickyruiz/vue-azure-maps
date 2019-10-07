import Vue, { WatchOptions } from 'vue'

export function bindPropsToOptions<K>({
  props,
  vm,
}: BindPropsToOptionsConfig): K {
  let options: Record<string, any> = {}

  for (const prop of props) {
    const propConfig = getPropConfig(prop)
    const { propName, targetPropName = propName } = propConfig

    bindProp(propConfig, vm)

    options[targetPropName] = (vm as any)[propName]
  }

  return options as K
}

export function getPropConfig(
  prop: string | PropToOptionConfig
): PropToOptionConfig {
  return typeof prop === 'string' ? { propName: prop } : prop
}

export function bindProp(
  {
    propName,
    targetPropName = propName,
    watchHandler = () => {},
    watchOptions,
    emittedEventName = `update:${propName}`,
  }: PropToOptionConfig,
  vm: Vue
): void {
  vm.$watch(propName, watchHandler, watchOptions)
}

export interface BindPropsToOptionsConfig {
  props: (string | PropToOptionConfig)[]
  vm: Vue
}

export interface PropToOptionConfig {
  propName: string
  targetPropName?: string
  watchHandler?: (val: any, oldVal: any) => void
  watchOptions?: WatchOptions
  emittedEventName?: string
}

export default bindPropsToOptions
