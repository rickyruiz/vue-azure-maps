---
prev: false
next: ./installation.md
---

# Introduction

Vue Azure Maps is a library for Vue.js that integrates Azure Maps. It offers several Vue components out of the box and supports custom ones as well. This library has a dependency to Azure Maps Control Web SDK which uses Mapbox to render performant WebGL.

Vue Azure Maps enables us to declaratively render map components to the DOM using straightforward template syntax:

```vue
<template>
  <AzureMap :center="[-122.33, 47.6]" :zoom="12" />
</template>
```

Which is more or less equivalent to this:

```javascript
var map = new atlas.Map('map', {
  center: [-122.33, 47.6],
  zoom: 12,
  authOptions: {
    authType: 'subscriptionKey',
    subscriptionKey: '<subscription-key>',
  },
})
```
