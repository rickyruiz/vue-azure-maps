import { atlas } from 'types'
import Vue from 'vue'
import { findParentComponentByName } from '.'

export function getMapInjection(vm: Vue): (() => atlas.Map) | undefined {
  return getInjection<() => atlas.Map>({
    vm: vm,
    injectionName: 'getMap',
    injectedPropertyLabel: 'map instance',
    sourceComponentName: 'AzureMap',
  })
}

export function getDataSourceInjection(
  vm: Vue
): (() => atlas.source.DataSource) | undefined {
  return getInjection<() => atlas.source.DataSource>({
    vm: vm,
    injectionName: 'getDataSource',
    injectedPropertyLabel: 'data source',
    sourceComponentName: 'AzureMapDataSource',
  })
}

export function getInjection<T>({
  vm,
  injectionName,
  injectedPropertyLabel,
  sourceComponentName,
}: GetInjectionConfig): T | undefined {
  const injection = (vm as Record<string, any>)[injectionName]

  if (
    !isValidInjection(
      vm,
      injection,
      injectedPropertyLabel,
      vm.$options.name || '',
      sourceComponentName
    )
  )
    return

  return injection as T
}

function isValidInjection(
  vm: Vue,
  injection: unknown | undefined,
  injectedPropertyLabel: string,
  componentName: string,
  parentName?: string
): boolean {
  const isValid = Boolean(injection)

  if (!isValid && process.env.NODE_ENV !== 'production') {
    console.warn(
      `Invalid <${componentName}> ${injectedPropertyLabel}.${
        parentName && !findParentComponentByName(vm, parentName)
          ? `\nPlease make sure <${componentName}> is a descendant of <${parentName}>.`
          : ``
      }`
    )
  }

  return isValid
}

export interface GetInjectionConfig {
  vm: Vue
  injectionName: string
  injectedPropertyLabel: string
  sourceComponentName: string
}
