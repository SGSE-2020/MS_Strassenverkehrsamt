<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <h1>Liste aller belegten Kennzeichen</h1>
      <br />
      <v-col cols="12" sm="6">
        <v-text-field
          label="Suche"
          single-line
          v-model="searchString"
        ></v-text-field>
      </v-col>
      <br />
      <v-card v-for="item in filteredList" :key="item" outlined class="mb-2">
        <v-card-title class="headline">
          <span
            v-html="item.city + ' ' + item.alpha + ' ' + item.number"
          ></span>
        </v-card-title>
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
      licenseplates: [
        {
          city: 'SC',
          alpha: 'AB',
          number: '1234'
        },
        {
          city: 'SC',
          alpha: 'AC',
          number: '1204'
        }
      ],
      searchString: ''
    }
  },
  computed: {
    filteredList() {
      return this.licenseplates.filter((plate) => {
        const plateStr = plate.city + ' ' + plate.alpha + ' ' + plate.number
        return plateStr.toLowerCase().includes(this.searchString.toLowerCase())
      })
    }
  },
  mounted() {
    axios
      .get('/api/licenseplates/all')
      .then((response) => {
        this.licenseplates = response.data.result.map(function(element) {
          return element.plateId
        })
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {}
}
</script>
