import { atlas } from 'types'
import Vue from 'vue'

/**
 * This lets us accept individual props instead of an object in
 * our component, making our template more explicit and easier to handle.
 * @param props If this parameter is undefined, `this.$props` will be used to look for component props.
 */
export function getOptionsFromProps<T>(
  this: Vue,
  props?: Record<string, any>
): T | undefined {
  // Use props argument or component props
  let propEntries = Object.entries(props || this.$props)

  let options: Record<string, any> = {}

  // Look for all the properties that are not null
  for (const [prop, value] of propEntries) {
    if (value !== null) {
      let propName
      // Handle reserved attributes
      switch (prop) {
        case 'mapStyle':
          propName = 'style'
          break

        default:
          propName = prop
          break
      }
      options[`${propName}`] = value
    }
  }

  // Return undefined if all props were null
  if (Object.keys(options).length === 0) return

  return options as T
}

export function addEventsFromListeners(this: Vue, { map, target, reservedEventTypes = [] }: { map: atlas.Map; target?: any; reservedEventTypes?: string[]; }): void {
  // Use component listeners
  let listenersEntries = Object.entries(this.$listeners)

  for (const [eventType, callback] of listenersEntries) {
    if (!reservedEventTypes.includes(eventType)) {
      if (target) {
        map.events.add(eventType as any, target, callback as any)
      } else {
        map.events.add(eventType as any, callback as any)
      }
    }
  }
}