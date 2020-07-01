<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <h1>gRPC - Strassenverkehrsamt</h1>
      <br />
      <v-card outlined class="mb-2 pa-4">
        <v-card-title class="headline">
          <span>Straßenverkehrsamt - Nummernschild</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              type="text"
              label="licenseplateID"
              prepend-icon="mdi-account-circle"
              v-model="licenseplateID"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="getLicensePlate()">Senden</v-btn>
        </v-card-actions>
        <v-card-text>{{ licenseplateResponse }}</v-card-text>
      </v-card>
      <br />
      <v-card outlined class="mb-2 pa-4">
        <v-card-title class="headline">
          <span>Straßenverkehrsamt - Führerschein</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              type="text"
              label="driverslicenseUID"
              prepend-icon="mdi-account-circle"
              v-model="driverslicenseUID"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="getDriversLicense()">Senden</v-btn>
        </v-card-actions>
        <v-card-text>{{ driverslicenseResponse }}</v-card-text>
      </v-card>
      <br />
      <v-card outlined class="mb-2 pa-4">
        <v-card-title class="headline">
          <span>Bürgerbüro - Ankündigung</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-textarea
              type="text"
              label="driverslicenseUID"
              prepend-icon="mdi-account-circle"
              v-model="announcementBody"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="getDriversLicense()">Senden</v-btn>
        </v-card-actions>
        <v-card-text>{{ announcementResponse }}</v-card-text>
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
      messages: [],
      licenseplateID: 'SC RT 1337',
      licenseplateResponse: '',
      driverslicenseUID: '2WWhXXQsd1fC0a4SD16WjaI3hrq2',
      driverslicenseResponse: '',
      announcementBody: JSON.stringify({
        title: 'ein Titel',
        text: 'ein Text',
        image: undefined,
        service: 'ein Service'
      }),
      announcementResponse: ''
    }
  },
  computed: {},
  mounted() {},
  methods: {
    getLicensePlate() {
      axios
        .get('/api/grpc/licenseplate/' + this.licenseplateID)
        .then((response) => {
          console.log('licenseplate success')
          console.log(response)
          this.licenseplateResponse = JSON.stringify(response.data, null, 2)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getDriversLicense() {
      axios
        .get('/api/grpc/driverslicense/' + this.driverslicenseUID)
        .then((response) => {
          console.log('licenseplate success')
          console.log(response)
          this.driverslicenseResponse = JSON.stringify(response.data, null, 2)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    postAnnouncement() {
      axios
        .post('/api/grpc/announcement', this.announcementBody)
        .then((response) => {
          console.log('announcement success')
          console.log(response)
          this.announcementResponse = JSON.stringify(response.data, null, 2)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
