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
          v-for="(item, i) in items"
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
          to: '/'
        },
        {
          icon: 'mdi-account',
          title: 'Konto',
          to: '/account'
        },
        {
          icon: 'mdi-file-document-edit',
          title: 'Anträge',
          to: '/application'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Kennzeichen',
          to: '/licenseplate'
        }
      ],
      miniVariant: false,
      right: true,
      title: 'MS_Strassenverkehrsamt'
    }
  }
}
</script>
