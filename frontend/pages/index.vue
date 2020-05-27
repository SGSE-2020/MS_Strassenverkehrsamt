<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card v-for="item in getData" :key="item" outlined class="mb-2">
        <v-card-title class="headline">
          <span v-html="item"></span>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      test: 'testvalue',
      entries: ['Hallo', 'dies', 'sind', 'demo','daten']
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
  created: function () {
    this.callAPI();
  },
  methods: {
    callAPI() {
      fetch('/api/hello')
        .then(response => response.json())
        .then(data => {
          console.log(data.somedata);
          //this.entries = data.somedata;
        });
    }
  }
}
</script>
