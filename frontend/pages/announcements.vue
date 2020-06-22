<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <h1>Ankündigungen</h1>
      <br />
      <v-card outlined class="mb-2 pa-4">
        <v-card-title class="headline">
          <span>Neue Ankündigung</span>
        </v-card-title>
        <v-card-actions>
          <v-btn color="info" @click="saveRoles(rolesEntries[i])"
            >Erstellen</v-btn
          >
        </v-card-actions>
      </v-card>
      <br />
      <v-card
        v-for="item in announcements"
        :key="item"
        outlined
        class="mb-2 pa-4"
      >
        <v-card-title class="headline">
          <span v-html="item.titel"></span>
        </v-card-title>
        <v-card-text v-html="item.text"></v-card-text>
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
      announcements: []
    }
  },
  computed: {},
  mounted() {
    axios
      .get('/api/announcements/all')
      .then((response) => {
        this.announcements = response.data.result
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    createAnnouncement(title, text) {
      console.log(title)
      console.log(text)
    }
  }
}
</script>
