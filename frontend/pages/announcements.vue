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
          <v-alert
            type="success"
            dismissible
            v-if="newAnnouncementResult.result === 'success'"
            :value="newAnnouncementResult"
            >{{ newAnnouncementResult.message }}</v-alert
          >
          <v-alert
            type="error"
            dismissible
            v-if="newAnnouncementResult.result === 'failure'"
            :value="newAnnouncementResult"
            >{{ newAnnouncementResult.message }}</v-alert
          >
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
      newAnnouncementResult: {}
    }
  },
  computed: {},
  mounted() {
    this.getAnnouncements()
  },
  methods: {
    getAnnouncements() {
      axios
        .get('/api/announcements/all')
        .then((response) => {
          this.announcements = response.data.message
        })
        .catch((error) => {
          console.log(error)
        })
    },
    createAnnouncement() {
      axios
        .put('/api/announcements/new', {
          title: this.newAnnouncementTitle,
          text: this.newAnnouncementText
        })
        .then((response) => {
          this.setMessage('success', 'Ankündigung erfolgreich erstellt')

          this.newAnnouncementTitle = ''
          this.newAnnouncementText = ''

          this.getAnnouncements()
        })
        .catch((error) => {
          console.log(error)
          this.setMessage(
            'failure',
            'Ankündigung konnte nicht erstellt werden! Fehler im Backend.'
          )
        })
    },
    setMessage(type, msg) {
      this.newAnnouncementResult = {
        result: type,
        message: msg
      }
    }
  }
}
</script>
