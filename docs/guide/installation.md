# Installation

## NPM

```sh
npm install vue-azure-maps
```

## Yarn

```sh
yarn add vue-azure-maps
```

## Setup

:::tip

Get an Azure Maps key at <https://azure.com/maps>

:::

When using with a module system, you must explicitly install `vue-azure-maps` via `Vue.use()`:

```javascript
import Vue from 'vue'
import VueAzureMaps from 'vue-azure-maps'

Vue.use(VueAzureMaps, {
  key: '<Your Azure Maps key>',
})
```

You don't need to do this when using global script tags.
