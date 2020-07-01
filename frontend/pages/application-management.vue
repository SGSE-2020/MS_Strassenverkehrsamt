<template>
  <v-flex justify="center" class="flex-column">
    <v-dialog v-model="dialog" persistent max-width="800px">
      <template v-slot:activator="{ on, attrs }">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="applications"
          item-key="name"
          class="elevation-1"
          @click:row="openApplication"
          v-bind="attrs"
          v-on="on"
        >
          <template v-slot:top> </template>
        </v-data-table>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Antrag</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formType"
                  :items="['Nummernschild', 'Führerschein', 'Umweltplakette']"
                  label="Typ"
                  required
                  readonly
                ></v-select>
              </v-col> </v-row
            ><v-row
              v-if="
                formType === 'Nummernschild' || formType === 'Umweltplakette'
              "
            >
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formPlateIdCity"
                  label="Stadtkennung"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formPlateIdAlpha"
                  label="Buchstaben"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formPlateIdNumber"
                  label="Zahl"
                  required
                  readonly
                ></v-text-field>
              </v-col> </v-row
            ><v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formText"
                  label="Text"
                  required
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formStatus"
                  :items="['Offen', 'Geschlossen', 'Abgelehnt', 'Angenommen']"
                  label="Status"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn icon :href="`mailto:${formEmail}`" color="primary">
            <v-icon>mdi-email</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="cancel" text @click="deleteApplication()"
            >Löschen</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="cancel" text @click="clearForm()">Abbrechen</v-btn>
          <v-btn color="accept" text @click="saveApplication()"
            >Übernehmen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script>
const axios = require('axios')

export default {
  components: {},
  data() {
    return {
      singleSelect: false,
      selected: [],
      dialog: false,
      dialogNew: false,
      headers: [
        { text: 'id', value: '_id' },
        { text: 'E-Mail', value: 'email' },
        {
          text: 'Typ',
          align: 'start',
          value: 'type'
        },
        { text: 'Status', value: 'status' },
        { text: 'Datum', value: 'date' }
      ],
      applications: [],
      formPlateIdCity: undefined,
      formPlateIdAlpha: undefined,
      formPlateIdNumber: undefined,
      formText: undefined,
      formType: undefined,
      formEmail: undefined,
      formStatus: undefined,
      originStatus: undefined,
      formId: undefined
    }
  },
  computed: {},
  mounted() {
    this.refreshApplication()
  },
  methods: {
    refreshApplication() {
      this.applications = []
      axios
        .get('/api/applications/all')
        .then((response) => {
          response.data.data.forEach(async (entry) => {
            const newEntry = {}

            newEntry._id = entry._id

            if (entry.type === 'plate') newEntry.type = 'Nummernschild'
            else if (entry.type === 'license') newEntry.type = 'Führerschein'
            else if (entry.type === 'badge') newEntry.type = 'Umweltplakette'

            if (entry.status === 'open') newEntry.status = 'Offen'
            else if (entry.status === 'closed') newEntry.status = 'Geschlossen'
            else if (entry.status === 'denied') newEntry.status = 'Abgelehnt'
            else if (entry.status === 'accepted') newEntry.status = 'Angenommen'

            newEntry.date = new Date(entry.timestamp).toLocaleString()

            try {
              const accountResponse = await axios.get(
                '/api/account/' + entry.uid
              )
              if (accountResponse.status === 200) {
                newEntry.email = accountResponse.data.data.email
              }
            } catch (err) {
              // ignore error
            }

            this.applications.push(newEntry)
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    openApplication(entry) {
      axios
        .get('/api/applications/' + entry._id)
        .then((response) => {
          this.formType = entry.type

          if (
            this.formType === 'Nummernschild' ||
            this.formType === 'Umweltplakette'
          ) {
            this.formPlateIdCity = response.data.data.plateId.city
            this.formPlateIdAlpha = response.data.data.plateId.alpha
            this.formPlateIdNumber = response.data.data.plateId.number
          }
          this.formText = response.data.data.text
          this.formEmail = entry.email
          this.formStatus = entry.status
          this.originStatus = entry.status
          this.formId = entry._id

          this.dialog = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async saveApplication() {
      let statustemp = ''
      if (this.formStatus === 'Offen') statustemp = 'open'
      else if (this.formStatus === 'Geschlossen') statustemp = 'closed'
      else if (this.formStatus === 'Abgelehnt') statustemp = 'denied'
      else if (this.formStatus === 'Angenommen') statustemp = 'accepted'

      await axios
        .put('/api/applications/' + this.formId, {
          status: statustemp
        })
        .then((response) => {
          console.log(response.status)
          if (
            response.status === 202 &&
            this.formStatus === 'Angenommen' &&
            this.originStatus === 'Offen'
          ) {
            console.log('Offen => Angenommen')

            axios
              .post('/api/applications/process/' + this.formId)
              .then((response) => {
                console.log(response.data)
              })
              .catch((error) => {
                console.log(error)
              })
          }
        })
        .catch((error) => {
          console.log(error)
        })

      this.clearForm()
      this.refreshApplication()
    },
    clearForm() {
      this.dialog = false
      this.dialogNew = false

      this.formType = undefined
      this.formText = undefined
      this.formPlateIdCity = undefined
      this.formPlateIdAlpha = undefined
      this.formPlateIdNumber = undefined
    },
    async deleteApplication() {
      await axios
        .delete('/api/applications/' + this.formId)
        .then((response) => {
          console.log(response.status)
        })
        .catch((error) => {
          console.log(error)
        })

      this.clearForm()
      this.refreshApplication()
    }
  }
}
</script>
