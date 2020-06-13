<template>
  <v-layout>
    <v-flex class="text-center">
      <h1>Melde dich mit deinem SmartCity Konto an</h1>
      <br />
      <v-card width="500" class="mx-auto mt-5 elevation-5">
        <v-card-title><h1 class="display-1">Login</h1></v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              label="Benutzername"
              prepend-icon="mdi-account-circle"
            />
            <v-text-field
              :type="showPassword ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              append-icon="mdi-eye-off"
              label="Passwort"
              @click:append="showPassword = !showPassword"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info">Login</v-btn>
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
      showPassword: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    login() {
      console.log('loginUser')
    }
  }
}
</script>
