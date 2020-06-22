<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in activeMenu"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app class="elevation-1">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>

      <!--- <v-toolbar-title v-text="title" /> --->
      <v-img
        :src="require('@/assets/banner.png')"
        max-width="400"
        aspect-ratio="7.94"
      />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span
        >&copy; {{ new Date().getFullYear() }} Stra&szlig;enverkehrsamt
        SmartCity</span
      >
    </v-footer>
  </v-app>
</template>

<script>
const axios = require('axios')

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Startseite',
          to: '/',
          showToAnyone: true,
          showToUser: true,
          showToWorker: true
        },
        {
          icon: 'mdi-account',
          title: 'Konto',
          to: '/account',
          showToAnyone: true,
          showToUser: true,
          showToWorker: true
        },
        {
          icon: 'mdi-file-document-edit',
          title: 'Anträge',
          to: '/application',
          showToAnyone: false,
          showToUser: true,
          showToWorker: true
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Kennzeichen',
          to: '/licenseplate',
          showToAnyone: false,
          showToUser: false,
          showToWorker: true
        }
      ],
      miniVariant: false,
      right: true,
      title: 'MS_Strassenverkehrsamt'
    }
  },
  computed: {
    activeMenu() {
      const menu = []
      this.items.forEach((item) => {
        if (item.showToAnyone) menu.push(item)
        else if (this.$store.state.loggedIn && item.showToUser) menu.push(item)
        else if (
          this.$store.state.loggedIn &&
          this.$store.state.roles.includes('worker') &&
          item.showToWorker
        )
          menu.push(item)
      })
      return menu
    }
  },
  mounted() {
    // Add Authorization with access token
    axios.interceptors.request.use(
      (config) => {
        let token = 'none'
        if (this.$store.state.loggedIn !== false)
          token = this.$store.state.token
        config.headers.Authorization = token
        console.log(
          'Token added to request: ' + config.method + ' ' + config.url
        )
        return config
      },
      (error) => {
        Promise.reject(error)
      }
    )

    // Resent request with new token if
    axios.interceptors.response.use(
      (response) => {
        // Return a successful response back to the calling service
        return response
      },
      async (error) => {
        // Return any error which is not due to authentication back to the calling service
        if (error.response.status !== 401) {
          return new Promise((resolve, reject) => {
            reject(error)
          })
        }

        console.log('resent request with new token')

        // Try request again with new token
        await this.$store.dispatch('refeshToken')
        // New request with new token
        const config = error.config
        config.headers.Authorization = this.$store.state.token

        return new Promise((resolve, reject) => {
          axios
            .request(config)
            .then((response) => {
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        })
      }
    )
  }
}
</script>
