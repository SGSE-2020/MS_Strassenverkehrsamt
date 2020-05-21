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
      test: 'testvalue'
    }
  },
  computed: {
    getData() {
      return ['Hallo', 'dies', 'sind', 'daten']
    }
  }
}
</script>
