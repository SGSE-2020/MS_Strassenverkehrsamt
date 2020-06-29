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
          <v-btn color="secondary" @click="createAnnouncement()"
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
          <span v-html="item.title"></span>
        </v-card-title>
        <v-card-text v-html="item.text"></v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteAnnouncement(item.id)"
            >Löschen</v-btn
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
      announcements: [],
      newAnnouncementTitle: '',
      newAnnouncementText: '',
      newAnnouncementResult: {}
    }
  },
  computed: {},
  mounted() {
    this.refreshAnnouncements()
  },
  methods: {
    refreshAnnouncements() {
      axios
        .get('/api/announcements/all')
        .then((response) => {
          this.announcements = response.data.data
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

          this.refreshAnnouncements()
        })
        .catch((error) => {
          console.log(error)
          this.setMessage(
            'failure',
            'Ankündigung konnte nicht erstellt werden! Fehler im Backend.'
          )
        })
    },
    deleteAnnouncement(id) {
      console.log('delete ' + id)

      axios
        .delete('/api/announcements/' + id)
        .then((response) => {
          console.log(response.message)
          this.refreshAnnouncements()
        })
        .catch((error) => {
          console.log(error)
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
