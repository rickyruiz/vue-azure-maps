module.exports = {
  title: 'Vue Azure Maps',

  description: 'Integrate Azure Maps in your Vue application',

  base: '/vue-azure-maps/',

  head: [
    [
      'meta',
      {
        charset: 'utf-8',
      },
    ],
    [
      'meta',
      {
        name: 'msapplication-TileColor',
        content: '#ffffff',
      },
    ],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/img/mstile-150x150.png',
      },
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#4DBA87',
      },
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        href: '/img/apple-icon-60x60.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: '/img/apple-icon-76x76.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: '/img/apple-icon-120x120.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/img/apple-icon-152x152.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-icon-180x180.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '144x144',
        href: '/img/android-icon-144x144.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/img/android-icon-192x192.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '256x256',
        href: '/img/android-icon-256x256.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '384x384',
        href: '/img/android-icon-384x384.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        href: '/img/android-icon-512x512.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/img/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon-32x32.png',
      },
    ],
  ],

  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Azure Maps',
      description: 'Integrate Azure Maps in your Vue application',
    },
    '/': {
      lang: 'es-MX',
      title: 'Vue Azure Maps',
      description: 'Integra Azure Maps en tu aplicación de Vue',
    },
  },

  themeConfig: {
    repo: 'rickyruiz/vue-azure-maps',
    docsRepo: 'rickyruiz/vue-azure-maps',
    docsDir: 'vuepress',
    editLinks: true,
    serviceWorker: {
      updatePopup: {
        message: 'New content is available.',
        buttonText: 'Refresh',
      },
    },
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Help us improve this page!',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/introduction',
          },
          // {
          //   text: 'Release Notes',
          //   link: 'https://github.com/rickyruiz/vue-azure-maps/releases',
          // },
        ],

        sidebar: [
          {
            title: 'Guide',
            collapsable: false,
            children: ['/guide/introduction', '/guide/installation'],
          },
          {
            title: 'Components',
            collapsable: false,
            children: [
              '/components/AzureMap',
              {
                title: 'Other',
                collapsable: false,
                children: [
                  '/components/other/AzureMapDataSource',
                  '/components/other/AzureMapHtmlMarker',
                  '/components/other/AzureMapPopup',
                  '/components/other/AzureMapImageSpriteIcon',
                  '/components/other/AzureMapUserPosition',
                  '/components/other/AzureMapSpiderClusterManager',
                ],
              },
              {
                title: 'Geometries',
                collapsable: false,
                children: [
                  '/components/geometries/AzureMapPoint',
                  '/components/geometries/AzureMapPolygon',
                  '/components/geometries/AzureMapLineString',
                  '/components/geometries/AzureMapCircle',
                ],
              },
              {
                title: 'Layers',
                collapsable: false,
                children: [
                  '/components/layers/AzureMapSymbolLayer',
                  '/components/layers/AzureMapLineLayer',
                  '/components/layers/AzureMapPolygonLayer',
                  '/components/layers/AzureMapBubbleLayer',
                  '/components/layers/AzureMapHeatMapLayer',
                  '/components/layers/AzureMapTileLayer',
                  '/components/layers/AzureMapImageLayer',
                ],
              },
              {
                title: 'Controls',
                collapsable: false,
                children: [
                  '/components/controls/AzureMapZoomControl',
                  '/components/controls/AzureMapPitchControl',
                  '/components/controls/AzureMapCompassControl',
                  '/components/controls/AzureMapStyleControl',
                  '/components/controls/AzureMapFullscreenControl',
                ],
              },
            ],
          },
        ],
      },
    },
  },
}
