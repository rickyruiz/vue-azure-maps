import Vue from 'vue'

export function getOptionsFromProps<T>(
  this: Vue,
  props?: Record<string, any>
): T | undefined {
  // Use passed props or component props
  let propEntries = Object.entries(props || this.$props)

  let options: Record<string, any> = {}

  // Look for all the properties that are not null
  for (const [prop, value] of propEntries) {
    if (value !== null) {
      options[`${prop}`] = value
    }
  }

  // Return undefined if all props were null
  if (Object.keys(options).length === 0) return

  return options as T
}
