<template>
  <v-layout>
    <v-flex class="text-center">
      <h1 v-if="this.$store.state.user == null">
        Melde dich mit deinem SmartCity Konto an:
      </h1>
      <h1 v-else>Du bist eingeloggt</h1>
      <br />
      <v-card
        width="500"
        class="mx-auto mt-5 elevation-5"
        v-if="this.$store.state.user == null"
      >
        <v-card-title><h1 class="display-1">Login</h1></v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
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
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="loginUser()">Login</v-btn>
          <v-btn color="info" @click="logoutUser()">Logout</v-btn>
        </v-card-actions>
      </v-card>

      <v-card width="500" class="mx-auto mt-5 elevation-5" v-else>
        <v-card-title><h1 class="display-1">Status</h1></v-card-title>
        <v-card-text>
          <v-text-field
            label="E-Mail"
            v-model="this.$store.state.user.email"
            disabled
          />
          <v-text-field
            label="UID"
            v-model="this.$store.state.user.uid"
            disabled
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="logoutUser()">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      showPassword: false,
      formEmail: '',
      formPassword: ''
    }
  },
  computed: {},
  mounted() {},
  methods: {
    async loginUser() {
      this.loading = true
      try {
        await this.$store.dispatch('login', {
          email: this.formEmail,
          password: this.formPassword
        })
        // this.$router.push('/account')
        console.log('success login')
        console.log(this.$store.state.user.uid)
      } catch (error) {
        this.loading = false
        console.error(error.message)
      }
    },
    async logoutUser() {
      this.loading = true
      try {
        await this.$store.dispatch('logout')
        // this.$router.push('/account')
        console.log('success logout')
        console.log(this.$store.state.user.uid)
      } catch (error) {
        this.loading = false
        console.error(error.message)
      }
    }
  }
}
</script>
