<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <h1>Liste aller belegten Kennzeichen</h1>
      <br />
      <v-card v-for="item in licenseplates" :key="item" outlined class="mb-2">
        <v-card-title class="headline">
          <span v-html="item.uid"></span>
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
      licenseplates: []
    }
  },
  computed: {},
  mounted() {
    axios
      .get('/api/licenseplate/all', {
        headers: {
          Authorization: this.$store.state.user.stsTokenManager.accessToken
        }
      })
      .then((response) => {
        this.licenseplates = response.data.result
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {}
}
</script>
