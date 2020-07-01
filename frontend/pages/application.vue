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
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formStatus"
                  :items="['Offen', 'Geschlossen']"
                  label="Status"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*benötigte Felder</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cancel" text @click="clearForm()">Abbrechen</v-btn>
          <v-btn
            color="accept"
            text
            @click="
              openConfirmationDialog(
                'Speichern',
                'Wollen Sie den Antrag speichern?',
                saveApplication
              )
            "
            >Übernehmen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-spacer />

    <div class="my-2">
      <v-flex>
        <v-btn
          small
          color="secondary"
          @click="dialogNew = true"
          class="mr-2 mb-2"
          >Neuer Antrag</v-btn
        ><v-btn
          small
          color="secondary"
          @click="dialogNewSTP = true"
          class="mb-2"
          >Kurzzeitkennzeichen bestellen</v-btn
        >
      </v-flex>
    </div>

    <v-dialog v-model="dialogNew" persistent max-width="800px">
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
                ></v-select>
              </v-col> </v-row
            ><v-row v-if="formType === 'Nummernschild'">
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="defaultPlateIdCity"
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
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formPlateIdNumber"
                  label="Zahl*"
                  required
                ></v-text-field>
              </v-col> </v-row
            ><v-row v-if="formType === 'Umweltplakette'">
              <v-col cols="12" sm="6">
                <v-select
                  :items="['SC AB 1234', 'SC C 2005', 'SC D 6848']"
                  label="Nummernschild*"
                  required
                ></v-select>
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
          <v-btn color="cancel" text @click="clearForm()">Abbrechen</v-btn>
          <v-btn
            color="accept"
            text
            @click="
              openConfirmationDialog(
                'Erstellen',
                'Wollen Sie den Antrag erstellen?',
                createApplication
              )
            "
            >Übernehmen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNewSTP" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Bestellung</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <p>
                Die Bestellung eines Kurzzeitkennzeichen kosten 25€. Der
                Geldbetrag wird bei bestellung automatisch von Ihrem SmartCity
                Bankkonto abgebucht und das Kennzeichen steht Ihnen sofort zu
                Verfügung.
              </p>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="defaultPlateIdCity"
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
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="formPlateIdNumber"
                  label="Zahl*"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*benötigte Felder</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cancel" text @click="clearForm()">Abbrechen</v-btn>
          <v-btn
            color="accept"
            text
            @click="
              openConfirmationDialog(
                'Bestellen',
                'Wollen Sie das Kurzzeitkennzeichen kostenpflichtig bestellen?',
                orderSTP
              )
            "
            >Kostenpflichtig Bestellen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialog" max-width="300">
      <v-card>
        <v-card-title class="headline">{{ confirmDialogTitle }}</v-card-title>
        <v-card-text>
          {{ confirmDialogText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cancel" text @click="closeConfirmationDialog()">
            Abbrechen
          </v-btn>
          <v-btn
            color="accept"
            text
            @click="
              confirmDialogBtnConfirm()
              closeConfirmationDialog()
            "
          >
            Bestätigen
          </v-btn>
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
        {
          text: 'Typ',
          align: 'start',
          value: 'type'
        },
        { text: 'Status', value: 'status' },
        { text: 'Datum', value: 'date' }
      ],
      applications: [],
      defaultPlateIdCity: 'SC',
      formPlateIdCity: undefined,
      formPlateIdAlpha: undefined,
      formPlateIdNumber: undefined,
      formText: undefined,
      formType: undefined,
      formStatus: undefined,
      formId: undefined,
      confirmDialog: false,
      confirmDialogTitle: undefined,
      confirmDialogText: undefined,
      confirmDialogBtnConfirm: undefined,
      dialogNewSTP: false
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
      axios
        .get('/api/applications/my/' + entry._id)
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
          this.formStatus = entry.status
          this.formId = entry._id

          this.dialog = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async createApplication() {
      let typeTemp = ''
      if (this.formType === 'Nummernschild') typeTemp = 'plate'
      else if (this.formType === 'Umweltplakette') typeTemp = 'badge'
      else if (this.formType === 'Führerschein') typeTemp = 'license'

      const newApplication = {
        type: typeTemp,
        text: this.formText,
        status: 'open'
      }

      if (
        this.formType === 'Nummernschild' ||
        this.formType === 'Umweltplakette'
      ) {
        console.log('Nummernschild/Umweltplakette')
        newApplication.plateId = {
          city: this.formPlateIdCity,
          alpha: this.formPlateIdAlpha,
          number: this.formPlateIdNumber
        }
      }

      await axios
        .put('/api/applications/my', newApplication)
        .then((response) => {
          console.log(response.status)
        })
        .catch((error) => {
          console.log(error)
        })

      this.clearForm()
      this.refreshApplication()
    },
    async saveApplication() {
      let statustemp = ''
      if (this.formStatus === 'Offen') statustemp = 'open'
      else if (this.formStatus === 'Geschlossen') statustemp = 'closed'
      console.log(statustemp)

      await axios
        .put('/api/applications/my/' + this.formId, {
          status: statustemp,
          text: this.formText
        })
        .then((response) => {
          console.log(response.status)
        })
        .catch((error) => {
          console.log(error)
        })

      this.clearForm()
      this.refreshApplication()
    },
    async orderSTP() {
      const order = {
        alpha: this.formPlateIdAlpha,
        number: this.formPlateIdNumber
      }

      await axios
        .post('/api/applications/my/shorttermplate', order)
        .then((response) => {
          console.log(response.status)
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
      this.dialogNewSTP = false

      this.formType = undefined
      this.formText = undefined
      this.formPlateIdCity = undefined
      this.formPlateIdAlpha = undefined
      this.formPlateIdNumber = undefined
    },
    openConfirmationDialog(title, text, confirm) {
      this.confirmDialog = true
      this.confirmDialogTitle = title
      this.confirmDialogText = text
      this.confirmDialogBtnConfirm = confirm
    },
    closeConfirmationDialog() {
      this.confirmDialog = false
      this.confirmDialogTitle = undefined
      this.confirmDialogText = undefined
      this.confirmDialogBtnConfirm = undefined
    }
  }
}
</script>
