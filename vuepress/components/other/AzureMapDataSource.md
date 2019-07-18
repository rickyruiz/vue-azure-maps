# AzureMapDataSource

The `AzureMapDataSource` component is a wrapper component for the [DataSource class](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-maps-typescript-latest), it provides a way to handle the data of any geometry shape component.

Here is a an example using the `AzureMapDataSource` component to handle the data of an `AzureMapPoint` children component:

```vue{3-5}
<template>
  <AzureMap>
    <AzureMapDataSource>
      <AzureMapPoint :longitude="-73.985708" :latitude="40.75773" />
    </AzureMapDataSource>
  </AzureMap>
</template>

<script>
import { AzureMap, AzureMapDataSource, AzureMapPoint } from 'vue-azure-map'

export default {
  components: {
    AzureMap,
    AzureMapDataSource,
    AzureMapPoint,
  },
}
</script>
```

### Supported geometry shape components

`AzureMapDataSource` supports the following geometry shape components:

- [`AzureMapPoint`](../geometries/AzureMapPoint.md)
- [`AzureMapPolygon`](../geometries/AzureMapPolygon.md)
- [`AzureMapLineString`](../geometries/AzureMapLineString.md)
- [`AzureMapCircle`](../geometries/AzureMapCircle.md)

::: tip IMPORTANT

In order for geometry shape components to be visible, a layer component must be added as a child of `AzureMapDataSource`.

:::

```vue{5}
<template>
  <AzureMap>
    <AzureMapDataSource>
      <AzureMapPoint :longitude="-73.985708" :latitude="40.75773" />
      <AzureMapSymbolLayer />
    </AzureMapDataSource>
  </AzureMap>
</template>

<script>
import {
  AzureMap,
  AzureMapDataSource,
  AzureMapPoint,
  AzureMapSymbolLayer,
} from 'vue-azure-map'

export default {
  components: {
    AzureMap,
    AzureMapDataSource,
    AzureMapPoint,
    AzureMapSymbolLayer,
  },
}
</script>
```

### Supported layer components

`AzureMapDataSource` supports the following layer components:

- [`AzureMapSymbolLayer`](../layers/AzureMapSymbolLayer.md)
- [`AzureMapLineLayer`](../layers/AzureMapLineLayer.md)
- [`AzureMapPolygonLayer`](../layers/AzureMapPolygonLayer.md)
- [`AzureMapBubbleLayer`](../layers/AzureMapBubbleLayer.md)
- [`AzureMapHeatMapLayer`](../layers/AzureMapHeatMapLayer.md)

### Props

| Prop | Type | Default Value | Description |
| --- | --- | --- | --- |
| id | `string` | `azure-map-data-source-${index}` | A unique id that the user assigns to the data source. If this is not specified, then the data source will automatically be assigned an id. |
| maxZoom | `number` | `18` | Maximum zoom level at which to create vector tiles (higher means greater detail at high zoom levels). |
| cluster | `boolean` | `false` | A boolean indicating if Point features in the source should be clustered or not. If set to true, points will be clustered together into groups by radius. |
| clusterRadius | `number` | `50` | The radius of each cluster in pixels. |
| clusterMaxZoom | `number` | `maxZoom - 1` | The maximum zoom level in which to cluster points. Defaults to one zoom less than `maxZoom` so that last zoom features are not clustered. |
| clusterProperties | `object` | `undefined` | Defines custom properties that are calculated using expressions against all the points within each cluster and added to the properties of each cluster point. |
| lineMetrics | `boolean` | `false` | Specifies whether to calculate line distance metrics. This is required for line layers that specify `lineGradient` values. |
| tolerance | `number` | `0.375` | The Douglas-Peucker simplification tolerance that is applied to the data when rendering (higher means simpler geometries and faster performance). |
