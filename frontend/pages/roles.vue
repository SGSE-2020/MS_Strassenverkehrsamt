<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <h1>Rollen</h1>
      <br />
      <v-card
        v-for="(item, i) in rolesEntries"
        :key="item"
        outlined
        class="mb-2 pa-4"
      >
        <v-card-title class="headline">
          <span v-html="item.email"></span>
        </v-card-title>

        <v-select
          v-model="rolesEntries[i].roles"
          :items="items"
          chips
          multiple
          label="Rollen"
        >
          <template v-if="selectSlot" v-slot:selection="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text caption"
              >(+{{ model.length - 1 }} others)</span
            >
          </template>
        </v-select>

        <v-card-actions>
          <v-btn color="info" @click="saveRoles(rolesEntries[i])">save</v-btn>
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
      items: ['user', 'worker']
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
          response.data.result.forEach((entry) => {
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
