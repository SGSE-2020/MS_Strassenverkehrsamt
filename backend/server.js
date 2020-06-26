var MongoClient = require('mongodb').MongoClient;

const config = {
  INTERFACE: "0.0.0.0",
  PORT_REST: 8080,
  PORT_GRPC: 50051,
  mongodbURL: "mongodb://localhost:27017/",
  // RABBITMQ_CONNECTION: "amqp://localhost",  
  RABBITMQ_CONNECTION: "amqp://testmanager:sgseistgeil@ms-rabbitmq:5672/",
  RABBITMQ_EXCHANGE: "strassenverkehrsamt",
  RABBITMQ_QUEUE: "stva"  
};

process.on('uncaughtException', function (err) {
  MongoClient.connect(config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      const db = client.db('stva');
      db.collection("log").insertOne({
        type: 'node-catch-uncaughtException',
        timestamp: new Date().toISOString(),
        msg: "uncaughtException"
      });
    })
    .catch(console.error)
});

/* Start all components */
let messageService = require('./components/message_service');
console.log("Start messaging service");
messageService.initialize(config);

require('./components/api_rest')(config, messageService);
require('./components/api_grpc')(config);
