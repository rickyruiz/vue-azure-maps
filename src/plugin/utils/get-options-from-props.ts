function getOptionsFromProps<T>({
  props,
  excludedPropKeys = [],
  reservedAttributes = {},
}: OptionsFromPropsConfig): T {
  let propEntries = Object.entries({ ...props })

  let options: Record<string, any> = {}

  let reservedKeys = Object.keys(reservedAttributes)

  // Look for all the properties that have a truthy value
  for (const [prop, value] of propEntries) {
    if (
      !excludedPropKeys.includes(prop) &&
      value !== null &&
      value !== undefined
    ) {
      let propKey = prop

      // Handle reserved attributes
      if (reservedKeys.includes(prop)) {
        propKey = reservedAttributes[prop]
      }

      options[propKey] = value
    }
  }

  return options as T
}

export interface OptionsFromPropsConfig {
  props: Record<string, any>
  excludedPropKeys?: string[]
  reservedAttributes?: Record<string, string>
}

export default getOptionsFromProps
