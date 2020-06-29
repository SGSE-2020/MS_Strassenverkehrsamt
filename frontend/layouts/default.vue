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
        <v-list-item v-if="this.$store.state.account" two-line class="px-2">
          <v-list-item-avatar>
            <img
              v-if="this.$store.state.account.image"
              v-bind:src="this.$store.state.account.image"
            />
            <img v-else :src="require('@/assets/avatar.png')" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{
              this.$store.state.account.firstName +
                ' ' +
                this.$store.state.account.lastName
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              this.$store.state.account.email
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="this.$store.state.account"></v-divider>

        <v-list-item-group v-model="group" active-class="primary--text">
          <template v-for="(item, index) in activeMenu">
            <v-list-item
              :key="index"
              :to="item.to"
              router
              exact
              v-if="item.action === true"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
            <v-list-item :key="index" v-else-if="item.subheader">
              <v-subheader v-if="!miniVariant">{{ item.title }}</v-subheader>
              <v-divider v-else></v-divider>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      class="elevation-5"
      dark
      color="primary"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon href="https://portal.dvess.network/">
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>

      <!--- <v-toolbar-title v-text="title" /> --->
      <v-img
        :src="require('@/assets/banner_indigo.png')"
        class="mx-2"
        max-height="50"
        max-width="397"
        contain
      />
      <!--- <v-img
        :src="require('@/assets/banner.png')"
        class="mx-2"
        max-height="50"
        max-width="397"
        contain
      /> --->
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer fixed app>
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
      title: 'MS_Strassenverkehrsamt',
      clipped: true,
      drawer: false,
      fixed: false,
      miniVariant: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Startseite',
          to: '/',
          action: true,
          showToAnyone: true,
          showToUser: true,
          showToWorker: true
        },
        {
          icon: 'mdi-account',
          title: 'Konto',
          to: '/account',
          action: true,
          showToAnyone: true,
          showToUser: true,
          showToWorker: true
        },
        {
          icon: 'mdi-file-document-edit',
          title: 'Anträge',
          to: '/application',
          action: true,
          showToAnyone: false,
          showToUser: true,
          showToWorker: true
        },
        {
          title: 'Intern',
          subheader: true,
          showToAnyone: false,
          showToUser: false,
          showToWorker: true
        },
        {
          icon: 'mdi-file-document-edit',
          title: 'Anträge bearbeiten',
          to: '/application-management',
          action: true,
          showToAnyone: false,
          showToUser: false,
          showToWorker: true
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Kennzeichen',
          to: '/licenseplate',
          action: true,
          showToAnyone: false,
          showToUser: false,
          showToWorker: true
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Rollen',
          to: '/roles',
          action: true,
          showToAnyone: false,
          showToUser: false,
          showToWorker: true
        },
        {
          icon: 'mdi-bullhorn',
          title: 'Ankündigungen',
          to: '/announcements',
          action: true,
          showToAnyone: false,
          showToUser: false,
          showToWorker: true
        },
        {
          title: 'Debugging',
          subheader: true,
          showToAnyone: false,
          showToUser: true,
          showToWorker: true
        },
        {
          icon: 'mdi-bug-outline',
          title: 'Messages',
          to: '/debug/messages',
          action: true,
          showToAnyone: false,
          showToUser: true,
          showToWorker: true
        }
      ]
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

<style lang="stylus" scoped></style>
