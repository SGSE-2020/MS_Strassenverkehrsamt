<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <h1>Ankündigungen</h1>
      <br />
      <v-card outlined class="mb-2 pa-4">
        <v-card-title class="headline">
          <span>Neue Ankündigung</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              type="text"
              label="Title"
              prepend-icon="mdi-account-circle"
              v-model="newAnnouncementTitle"
            />
            <v-text-field
              type="text"
              label="Text"
              prepend-icon="mdi-account-circle"
              v-model="newAnnouncementText"
            />
          </v-form>
          <v-alert type="success" :value="newAnnouncementResponse" dismissible>
            Ankündigungen erfolgreich erstellt!
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="createAnnouncement()">Erstellen</v-btn>
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
          <span v-html="item.title"></span>
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
      announcements: [],
      newAnnouncementTitle: '',
      newAnnouncementText: '',
      newAnnouncementResponse: null
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
    createAnnouncement() {
      console.log(this.newAnnouncementTitle)
      console.log(this.newAnnouncementText)
      // this.newAnnouncementResponse = { text: this.newAnnouncementText }

      axios
        .put('/api/announcements/new', {
          title: this.newAnnouncementTitle,
          text: this.newAnnouncementText
        })
        .then((response) => {
          console.log(response.data)
          this.newAnnouncementResponse = response.data
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>
