const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;

module.exports = function (config) {

  MongoClient.connect(config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      const db = client.db('stva');

      router.get('/test', function (req, res, next) {
        res.send({
          "config": true
        })
      });
    })
    .catch(console.error)

  return router;
}