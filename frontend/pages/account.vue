<template>
  <v-layout>
    <v-flex class="text-center">
      <h1 v-if="this.$store.state.loggedIn == false">
        Melde dich mit deinem SmartCity Konto an:
      </h1>
      <h1 v-else>Du bist eingeloggt</h1>
      <br />
      <v-card
        width="500"
        class="mx-auto mt-5 elevation-5 login-form"
        v-if="this.$store.state.loggedIn == false"
      >
        <v-card-title><h1 class="display-1">Login</h1></v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              type="email"
              label="E-Mail"
              prepend-icon="mdi-account-circle"
              v-model="formEmail"
            />
            <v-text-field
              :type="showPassword ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              append-icon="mdi-eye-off"
              label="Passwort"
              v-model="formPassword"
              @click:append="showPassword = !showPassword"
            />
          </v-form>
          <v-alert
            v-if="this.errorMessage != null"
            type="error"
            v-html="this.errorMessage"
          >
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="loginUser()">Login</v-btn>
        </v-card-actions>
      </v-card>

      <v-card
        v-if="this.$store.state.loggedIn == true"
        width="500"
        class="mx-auto mt-5 elevation-5"
      >
        <v-card-title><h1 class="display-1">Status</h1></v-card-title>
        <v-card-text>
          <v-text-field label="UID" v-model="userUID" disabled />
          <v-text-field label="Name" v-model="userName" disabled />
          <v-text-field label="E-Mail" v-model="userEmail" disabled />
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="logoutUser()">Logout</v-btn>
          <v-btn color="info" @click="refreshToken()">Refresh Token</v-btn>
        </v-card-actions>
      </v-card>

      <v-card
        v-if="this.$store.state.loggedIn && this.$store.state.account"
        width="500"
        class="mx-auto mt-5 elevation-5"
      >
        <v-card-title><h1 class="display-1">Dein Konto</h1></v-card-title>
        <v-flex class="pb-1">
          <v-card
            width="450"
            class="mx-auto ma-5"
            outlined
            :color="validityColor(this.$store.state.account.license.validUntil)"
            v-if="this.$store.state.account.license"
          >
            <v-card-title><h3>Führerschein</h3></v-card-title>
            <v-card-text
              >gültig bis
              {{
                new Date(
                  this.$store.state.account.license.validUntil
                ).toUTCString()
              }}</v-card-text
            >
          </v-card>
          <v-card width="450" class="mx-auto ma-5" outlined>
            <v-card-title><h3>Nummernschilder</h3></v-card-title>
            <v-flex class="pb-1">
              <v-card
                width="400"
                class="mx-auto ma-5"
                outlined
                v-for="(item, index) in this.$store.state.account.plates"
                :key="index"
                :color="validityColor(item.validUntil)"
              >
                <v-card-title
                  ><h3>
                    {{
                      item.plateId.city +
                        ' ' +
                        item.plateId.alpha +
                        ' ' +
                        item.plateId.number
                    }}
                  </h3></v-card-title
                >
                <v-card-text
                  >gültig bis
                  {{ new Date(item.validUntil).toUTCString() }}</v-card-text
                >
              </v-card>
            </v-flex>
          </v-card>
        </v-flex>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { auth } from '~/plugins/firebase.js'
const axios = require('axios')

export default {
  components: {},
  data() {
    return {
      showPassword: false,
      formEmail: '',
      formPassword: '',
      errorMessage: null
    }
  },
  computed: {
    userName() {
      return auth.currentUser.displayName
    },
    userEmail() {
      return auth.currentUser.email
    },
    userUID() {
      return auth.currentUser.uid
    }
  },
  mounted() {
    if (this.$store.state.loggedIn) {
      this.getUserAccount()
    }
  },
  methods: {
    async loginUser() {
      this.loading = true
      try {
        await this.$store.dispatch('login', {
          email: this.formEmail,
          password: this.formPassword
        })
        console.log('success login')
        this.errorMessage = null

        this.getUserAccount()
      } catch (error) {
        this.loading = false
        this.errorMessage = error.message
        console.error(error.message)
      }
    },
    getUserAccount() {
      axios
        .get('/api/account/my')
        .then((response) => {
          console.log(response.data)
          this.$store.dispatch('setAccount', {
            account: response.data.data
          })

          axios
            .get('/api/roles/my')
            .then((response) => {
              console.log(response.data.data.roles)
              this.$store.dispatch('setRoles', {
                roles: response.data.data.roles
              })
            })
            .catch(function(error) {
              console.log(error)
            })
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    async logoutUser() {
      this.loading = true
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/account')

        this.loading = false
        this.errorMessage = null
      } catch (error) {
        this.loading = false
        this.errorMessage = error.message
        console.error(error.code)
      }
    },
    async refreshToken() {
      await this.$store.dispatch('refeshToken')
    },
    validityColor(timestamp) {
      if (Date.now() < new Date(timestamp)) {
        return 'valid'
      } else {
        return 'notvalid'
      }
    }
  }
}
</script>
