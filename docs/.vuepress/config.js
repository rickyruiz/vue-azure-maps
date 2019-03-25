module.exports = {
  title: 'Vue Azure Maps',

  description: 'Integrate Azure Maps in your Vue application',

  base: '/vue-azure-maps/',

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
    docsDir: 'docs',
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
        editLinkText: 'Edit this page on GitHub',
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
            children: ['/components/azure-map'],
          },
        ],
      },
    },
  },
}
