# Vue Azure Maps

[![npm](https://img.shields.io/npm/v/vue-azure-maps.svg) ![npm](https://img.shields.io/npm/dm/vue-azure-maps.svg)](https://www.npmjs.com/package/vue-azure-maps) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/) [![license](https://img.shields.io/npm/l/vue-azure-maps.svg)](https://github.com/rickyruiz/vue-azure-maps/blob/master/LICENSE)

Vue Azure Maps is a library for Vue.js that integrates Azure Maps. It offers several Vue components out of the box and supports custom ones as well. This library has a dependency to Azure Maps Control Web SDK which uses Mapbox to render performant WebGL.

Vue Azure Maps enables us to declaratively render map components to the DOM using straightforward template syntax.

> This library is a work in progress, once it is stabilized 1.0 will be released.

## Installation

### NPM

```sh
npm install vue-azure-maps
```

### Yarn

```sh
yarn add vue-azure-maps
```

## Setup

> Get an Azure Maps key at <https://azure.com/maps>

```javascript
import Vue from 'vue'
import VueAzureMaps from 'vue-azure-maps'

Vue.use(VueAzureMaps, {
  key: '<Your Azure Maps key>',
})
```

## Documentation

Read the [documentation and demos](https://rickyruiz.github.io/vue-azure-maps/).

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Ricardo Ruiz
