export default {

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'funny-movies',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'doescription', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'node_modules/lite-youtube-embed/src/lite-yt-embed.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/youtube.client.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyAtuG_KnHWE4IvG6sJ7FnkGjV5O27FJHq4',
          authDomain: 'funny-movies-a948d.firebaseapp.com',
          projectId: 'funny-movies-a948d',
          storageBucket: 'funny-movies-a948d.appspot.com',
          databaseURL: 'https://funny-movies-a948d-default-rtdb.firebaseio.com',
          messagingSenderId: '518328617754',
          appId: '1:518328617754:web:7a6095497b5bf189237aa3'
        },
        services: {
          auth: {
            persistence: 'local',
            /* Use for vuex store
            initialize: {
              onAuthStateChangedAction: 'onAuthStateChangedAction',
              subscribeManually: false
            },
            */
            // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
            ssr: false,
          },
          database: true
        }
      }
    ]
  ],

  bootstrapVue: {
    icons: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
