<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <h1>Rollen</h1>
      <br />
      <v-card
        v-for="(entry, i) in rolesEntries"
        :key="i"
        outlined
        class="mb-2 pa-4"
      >
        <v-card-title class="headline">
          <span v-html="entry.email"></span>
        </v-card-title>

        <v-select
          v-model="entry.roles"
          :items="roleItems"
          chips
          multiple
          label="Rollen"
        >
        </v-select>

        <v-card-actions>
          <v-btn color="accept lighten-1" @click="saveRoles(rolesEntries[i])"
            >save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const axios = require('axios')

export default {
  components: {},
  data() {
    return {
      test: 'testvalue',
      rolesEntries: [],
      roleItems: ['user', 'worker']
    }
  },
  computed: {},
  mounted() {
    this.refreshRoles()
  },
  methods: {
    refreshRoles() {
      this.rolesEntries = []
      axios
        .get('/api/roles/all')
        .then((response) => {
          response.data.data.forEach((entry) => {
            axios
              .get('/api/account/' + entry._id)
              .then((response) => {
                entry.email = response.data.data.email
                this.rolesEntries.push(entry)
              })
              .catch(function(error) {
                console.log(error)
              })
          })
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    saveRoles(role) {
      axios
        .put('/api/roles/' + role._id, {
          _id: role._id,
          roles: role.roles
        })
        .then((response) => {
          console.log(response.data)
          this.refreshRoles()
        })
        .catch(function(error) {
          console.log(error)
          this.refreshRoles()
        })
    },
    fetchUserDetails(uid) {
      axios
        .get('/api/account/' + uid)
        .then((response) => {
          console.log(response)
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>
