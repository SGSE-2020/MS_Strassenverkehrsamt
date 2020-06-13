<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="desserts"
    item-key="name"
    class="elevation-1"
  >
    <template v-slot:top> </template>
  </v-data-table>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      singleSelect: false,
      selected: [],
      headers: [
        {
          text: 'Typ',
          align: 'start',
          sortable: false,
          value: 'typ'
        },
        { text: 'Status', value: 'status' },
        { text: 'Datum', value: 'date' },
        { text: 'Action', value: 'action' }
      ],
      desserts: [
        {
          typ: 'Kennzeichen',
          status: 'Offen',
          date: '05.06.2020',
          action: '-'
        },
        {
          typ: 'Kennzeichen',
          status: 'Abgeleht',
          date: '22.04.2020',
          action: '-'
        },
        {
          typ: 'Kennzeichen',
          status: 'Angenommen',
          date: '12.03.2020',
          action: '-'
        }
      ]
    }
  },
  computed: {},
  mounted() {
    this.callAPI()
  },
  methods: {
    callAPI() {
      console.log('callAPI')
    }
  }
}
</script>
