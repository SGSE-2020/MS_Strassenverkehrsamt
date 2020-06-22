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
          <span v-html="item.uid"></span>
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
    axios
      .get('/api/roles/all')
      .then((response) => {
        this.rolesEntries = response.data.result
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    saveRoles(role) {
      console.log(role.uid)
      console.log(role.roles)

      axios
        .put('/api/roles/' + role.uid, {
          uid: role.uid,
          roles: role.roles
        })
        .then((response) => {
          console.log(response.data)
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>
