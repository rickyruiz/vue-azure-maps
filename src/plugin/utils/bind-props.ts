import { atlas } from 'types'
import Vue, { WatchOptions } from 'vue'
import { capitalize } from '.'
import addMapEventListeners from './add-map-event-listeners'

export function bindProp(
  vm: Vue,
  map: atlas.Map,
  {
    propName,
    targetPropName = propName,
    target,
    targetEventName,
    targetMethodName = targetPropName,
    getter,
    setter,
    isSetAsObject = true,
    watcher = (value: any) => value,
    watchOptions,
    identity = (a: any, b: any) => a === b,
    applier = (newValue: any, oldValue: any, set: (newValue: any) => void) =>
      !identity(newValue, oldValue) && set(newValue),
    retriever = isSetAsObject
      ? (value: Record<string, any>) => value[targetPropName]
      : (value: any) => value,
    emittedEventName = `update:${propName}`,
  }: PropBindingConfig
): () => void {
  let setValue: any
  const targetOrMap = target || map

  const capitalizedTargetMethodName = capitalize(targetMethodName)

  if (!getter) {
    getter = () =>
      targetOrMap && targetOrMap[`get${capitalizedTargetMethodName}`]()
  }

  if (!setter) {
    setter = (value: any) => {
      setValue = value

      targetOrMap &&
        targetOrMap[`set${capitalizedTargetMethodName}`](
          isSetAsObject ? { [targetPropName]: value } : value
        )
    }
  }

  vm.$watch(
    () => watcher((vm as any)[propName]),
    (newVal: any, oldVal: any) => {
      if (!identity(newVal, setValue) && setter) {
        applier(newVal, oldVal, setter)
      }
      setValue = newVal
    },
    watchOptions
  )

  let unbind = () => {
    // noop
  }

  if (targetEventName) {
    unbind = addMapEventListeners({
      listeners: {
        [targetEventName]: () => {
          if (getter) {
            const value = retriever(getter())

            if (!identity(value, setValue)) {
              vm.$emit(emittedEventName, value)
              setValue = value
            }
          }
        },
      },
      map,
      target,
    })
  }

  return unbind
}

export function bindProps({ vm, map, props }: BindPropsConfig): () => void {
  const boundProps: (() => void)[] = []

  for (const prop of props) {
    boundProps.push(bindProp(vm, map, prop))
  }

  return () => boundProps.forEach(unbind => unbind())
}

export interface BindPropsConfig {
  vm: Vue
  map: atlas.Map
  props: PropBindingConfig[]
}

export interface PropBindingConfig {
  propName: string
  targetPropName?: string
  target?: any
  targetEventName?: string
  targetMethodName?: string
  getter?: () => any
  setter?: (value: any) => void
  isSetAsObject?: boolean
  watcher?: (value: any) => any
  watchOptions?: WatchOptions
  applier?: (newVal: any, oldVal: any, set: (newVal: any) => void) => void
  identity?: (newVal: any, oldVal: any) => boolean
  retriever?: (value: any) => any
  emittedEventName?: string
}

export default bindProps
