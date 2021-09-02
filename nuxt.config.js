export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'spa-store',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/cesta.png' }],
  },

  router: {
    middleware: ['verifyRouters'],
  },

  ssr: false,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/main.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  env: {
    spastore_base_url: process.env.SPASTORE_URL_BASE,
    spastore_token: process.env.SPASTORE_TOKEN,
    spastore_url_conexiones: process.env.SPASTORE_URL_CONECTIONS,
    spastore_url_existencia_articulos:
      process.env.SPASTORE_URL_EXISTENCIA_ARTICULOS,
    spastore_url_existencia_detalle:
      process.env.SPASTORE_URL_EXISTENCIA_DETALLE,
    spastore_url_backend: process.env.SPASTORE_URL_BACKEND,
  },
}
