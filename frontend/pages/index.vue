<template>
  <v-layout column justify-center align-center>
    <v-card>
      <v-card-title class="headline">
        <span>Wilkommen beim Stra&szlig;enverkehrsamt vom SmartCity</span>
      </v-card-title>
    </v-card>
    <v-flex xs12 sm8 md6>
      <v-card v-for="item in entries" :key="item" outlined class="mb-2">
        <v-card-title class="headline">
          <span v-html="item"></span>
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
      entries: ['Hallo', 'dies', 'sind', 'demo', 'daten']
    }
  },
  computed: {
    /*
    getData() {
      //return ['Hallo', 'dies', 'sind', 'daten']

    fetch('/api/hello')
      .then(response => response.json())
      .then(data => {
        console.log(data.somedata);
        return data.somedata;
      });

    }
    */
  },
  mounted() {
    // Display inital values
    axios
      .get('/api/hello', {
        headers: {
          Authorization: this.$store.state.user.stsTokenManager.accessToken
        }
      })
      .then((response) => {
        // handle success
        console.log(response.data.somedata)
        this.entries = response.data.somedata
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    callAPI() {
      console.log('callAPI')
    }
  }
}
</script>
