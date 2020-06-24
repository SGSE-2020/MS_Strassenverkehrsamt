<template>
  <v-layout column justify-center align-center>
    <h1>Willkommen beim Straßenverkehrsamt von SmartCity</h1>
    <p>
      Loggen Sie sich mit Ihrem SmartCity Konto an um unsere Dienstleistungen in
      Anspruch zu nehmen.
    </p>
  </v-layout>
</template>

<script>
// const axios = require('axios')

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
  },
  methods: {
    callAPI() {
      console.log('callAPI')
    }
  }
}
</script>
