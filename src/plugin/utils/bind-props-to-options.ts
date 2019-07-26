import Vue, { WatchHandler, WatchOptions } from 'vue'

export function bindPropsToOptions<K>({
  props,
  context,
}: BindPropsToOptionsConfig<K>): K {
  let options: Record<string, any> = {}

  for (const prop of props) {
    bindProp(getPropConfig(prop), context)
  }

  return options as K
}

export function getPropConfig<T, K>(
  prop: string | PropToOptionConfig<T, K>
): PropToOptionConfig<T, K> {
  return typeof prop === 'string' ? { propName: prop } : prop
}

export function bindProp<T, K>(
  { propName, emittedEventName }: PropToOptionConfig<T, K>,
  context: Vue
): void {
  if (!emittedEventName) {
    emittedEventName = `update:${propName}`
  }
  // TODO: Create watch handlers to update options
}

export interface BindPropsToOptionsConfig<K> {
  props: (string | PropToOptionConfig<any, K>)[]
  context: Vue
}

export interface PropToOptionConfig<T, K> {
  propName: string
  targetPropName?: string
  target?: any
  watchHandler?: WatchHandler<T>
  watchOptions?: WatchOptions
  identity?: (val: T, oldVal: T) => boolean
  applier?: (val: T, oldVal: T) => void
  retriever?: () => K
  emittedEventName?: string
}
