import { atlas } from 'types'

function addMapEventListeners({
  map,
  listeners,
  target,
  reservedEventTypes = [],
}: MapEventListenersConfig): () => void {
  const mapListeners: (() => void)[] = []
  const listenersEntries = Object.entries(listeners)

  for (const [eventType, callback] of listenersEntries) {
    // Omit component's emitted events.
    // `.sync` modifier pattern for 'two-way binding': `update:`.
    if (
      reservedEventTypes.includes(eventType) ||
      eventType.startsWith('update:')
    )
      continue

    if (target) {
      map.events.add(eventType as any, target, callback as any)
      mapListeners.push(() =>
        map.events.remove(eventType as any, target, callback as any)
      )
    } else {
      map.events.add(eventType as any, callback as any)
      mapListeners.push(() =>
        map.events.remove(eventType as any, callback as any)
      )
    }
  }

  return () => mapListeners.forEach((removeListener) => removeListener())
}

export interface MapEventListenersConfig {
  map: atlas.Map
  listeners: Record<string, Function | Function[]>
  target?: any
  reservedEventTypes?: string[]
}

export default addMapEventListeners
