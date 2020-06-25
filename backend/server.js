var MongoClient = require('mongodb').MongoClient;

const config = {
  INTERFACE: "0.0.0.0",
  PORT_REST: 8080,
  PORT_GRPC: 50051,
  mongodbURL: "mongodb://localhost:27017/"
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
require('./components/api_rest')(config);
require('./components/api_grpc')(config);