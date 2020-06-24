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
                  label="Typ*"
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
                  label="Stadtkennung*"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formPlateIdAlpha"
                  label="Buchstaben*"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formPlateIdNumber"
                  label="Zahl*"
                  required
                  readonly
                ></v-text-field>
              </v-col> </v-row
            ><v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formText"
                  label="Text*"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*benötigte Felder</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Abbrechen</v-btn
          >
          <v-btn color="blue darken-1" text @click="saveApplication()"
            >Übernehmen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-spacer />
    <div class="my-2">
      <v-btn small color="primary" @click="dialogNew = true"
        >Neuer Antrag</v-btn
      >
    </div>
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
      formBadgeId: undefined,
      formText: undefined,
      formType: undefined
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
        .get('/api/applications/my/all')
        .then((response) => {
          response.data.data.forEach((entry) => {
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

            this.applications.push(newEntry)
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    openApplication(entry) {
      console.log(entry._id)

      axios
        .get('/api/applications/my/' + entry._id)
        .then((response) => {
          console.log(response.data.data)

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

          this.dialog = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    saveApplication() {
      this.dialog = false
      console.log(this.formType)
    }
  }
}
</script>
