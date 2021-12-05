export default {
  serverMiddleware: ['~/api/server/app.js'],

  mode: 'universal',

  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ระบบรับ-ส่งหนังสือราชการ',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=IBM+Plex+Sans:wght@400;700&display=swap" },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/scss/main.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],
  

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-buefy',
    '@nuxtjs/axios',
    '@nuxt/content',
    '@nuxtjs/auth',
    'cookie-universal-nuxt',
    '@nuxtjs/dotenv',
    'nuxt-browser-console',
  ],

  browserConsole: {
    namespace: 'console'
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: '/',
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            method: 'post',
            url: 'api/v1/login',
            propertyName: 'token',
          },
          user: { url: 'api/v1/user/me', method: 'get', propertyName: 'user' },
          logout: false,
        },
      },
    },
    cookie: {
      options: {
        secure: false
      }
    },
    redirect: {
      login: '/login'
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  }
}
