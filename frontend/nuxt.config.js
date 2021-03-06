import colors from 'vuetify/es5/util/colors'

let development = process.env.NODE_ENV !== 'production'

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    /* titleTemplate: '%s - ' + process.env.npm_package_name, */
    title: 'Straßenverkehrsamt SmartCity',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        name: "theme-color",
        content: "#5C6BC0"
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
      src: '~/plugins/firebase.js',
      ssr: false
    },
    {
      src: '~/plugins/localStorage.js',
      ssr: false
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: development ? 'http://localhost/' : 'http://strassenverkehrsamt.dvess.network/'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: colors.indigo.lighten1,
          // accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.grey,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3,
          accept: colors.green,
          cancel: colors.red,
          valid: colors.green.lighten5,
          notvalid: colors.red.lighten5
        }
      }
    }
  },
  /*
   ** PWA Config
   */
  pwa: {
    manifest: {
      name: 'Straßenverkehrsamt SmartCity',
      short_name: 'Strassenverkehrsamt',
      lang: 'de',
      background_color: "#5C6BC0",
      theme_color: "#5C6BC0",
      display: "standalone",
      description: "Die App für das Strassenverkehrsamt von SmartCity"
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    babel: {
      configFile: "./babel.config.js"
    }
  }
}
