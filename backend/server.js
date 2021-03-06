var MongoClient = require('mongodb').MongoClient;

const config = {
  INTERFACE: "0.0.0.0",
  PORT_REST: 8080,
  PORT_GRPC: 50051,
  mongodbURL: "mongodb://localhost:27017/",
  MONGODB_DATABASE: "stva",
  // RABBITMQ_CONNECTION: "amqp://localhost",  
  RABBITMQ_CONNECTION: "amqp://testmanager:sgseistgeil@ms-rabbitmq:5672/",
  RABBITMQ_EXCHANGE: "strassenverkehrsamt",
  RABBITMQ_QUEUE: "stva",
  STVA_IBAN: "DE 23 1520 0000 1699 5149 40"
};

process.on('uncaughtException', function (err) {
  console.trace()

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
let databaseService = require('./components/database_service');
console.log("Start database service...");
databaseService.initialize(config);

let messageService = require('./components/message_service');
console.log("Start messaging service...");
messageService.initialize(config, databaseService);

console.log("Start REST service...");
require('./components/api_rest')(config, messageService, databaseService);

console.log("Start gRPC service...");
require('./components/api_grpc')(config, messageService, databaseService);

console.log("MS_Strassenverkehrsamt running...");
