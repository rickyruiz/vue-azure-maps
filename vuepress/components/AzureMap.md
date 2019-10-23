# AzureMap

Use this component to create a map instance with some options.

```vue
<template>
  <AzureMap :center="[-122.33, 47.6]" :zoom="12" />
</template>

<script>
import { AzureMap } from 'vue-azure-maps'

export default {
  components: {
    AzureMap,
  },
}
</script>
```
