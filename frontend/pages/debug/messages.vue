<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <h1>RabbitMQ - Messages</h1>
      <br />
      <v-card outlined class="mb-2 pa-4">
        <v-card-title class="headline">
          <span>Neue Messages</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              type="text"
              label="RoutingKey"
              prepend-icon="mdi-account-circle"
              v-model="newRoutingKey"
            />
            <v-text-field
              type="text"
              label="Message"
              prepend-icon="mdi-account-circle"
              v-model="newMessage"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="sendNewMessage()">Senden</v-btn>
        </v-card-actions>
      </v-card>
      <br />
      <v-card
        v-for="(item, index) in messages"
        :key="index"
        outlined
        class="mb-2 pa-4"
      >
        <v-card-title class="headline">
          <span v-html="'Exchange: ' + item.fields.exchange"></span>
        </v-card-title>
        <v-card-text
          v-html="'Routing Key: ' + item.fields.routingKey"
        ></v-card-text>
        <v-card-text v-html="'Message: ' + item.content"></v-card-text>
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
      messages: [],
      newRoutingKey: '',
      newMessage: ''
    }
  },
  computed: {},
  mounted() {
    this.refreshMessages()
  },
  methods: {
    refreshMessages() {
      axios
        .get('/api/messages/all')
        .then((response) => {
          // this.messages = response.data.data
          this.messages = response.data.data.map((element) => {
            const temp = {
              fields: element.fields,
              properties: element.properties,
              content: element.content
            }

            try {
              temp.content = JSON.parse(element.content).message
            } catch (err) {
              // console.log('plain text')
            }

            return temp
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    sendNewMessage() {
      axios
        .post('/api/messages/msg', {
          routingKey: this.newRoutingKey,
          message: this.newMessage
        })
        .then((response) => {
          console.log('refresh success')

          this.refreshMessages()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  parseMessage(msg) {
    try {
      const content = JSON.parse(msg).message
      return content
    } catch (error) {
      return msg
    }
  }
}
</script>
