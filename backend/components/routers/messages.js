const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const amqplib = require('amqplib');

module.exports = function (config) {
  var connection = amqplib.connect(config.RABBITMQ_CONNECTION);

  MongoClient.connect(config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      const db = client.db('stva');

      // Publisher
      connection.then((conn) => {
        return conn.createChannel();
      }).then((channel) => {
        channel.assertExchange(config.RABBITMQ_EXCHANGE, 'fanout', {
          durable: true
        })
        return channel.assertQueue(config.RABBITMQ_QUEUE).then((ok) => {

          router.post('/msg', function (req, res) {
            const msg = {
              message: req.body,
              timestamp: Date.now()
            }

            var result = channel.sendToQueue(config.RABBITMQ_QUEUE, Buffer.from(JSON.stringify(msg)));
            if (result) {
              res.status(200).send({
                result: "success",
                message: msg
              });
            } else {
              res.status(500).send({
                result: "failure",
                message: msg
              });
            }

          });

          router.get('/alive', function (req, res) {
            res.send("alive")
          });
        });
      }).catch(console.warn);

    })
    .catch(console.error)

  return router;
}