const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;

module.exports = function (config) {

  MongoClient.connect(config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      const db = client.db('stva');

      // NqDh0ZKMVwXyVBgowVa088QKr7I2
      var data = {
        "_id": 'NqDh0ZKMVwXyVBgowVa088QKr7I2',
        roles: ['user', 'worker']
      }
      db.collection("roles").update({
        "_id": data._id
      }, data, {
        upsert: true
      }, function (err, result) {
        if (err) {
          db.collection("log").insertOne({type: 'worker role init',timestamp: new Date().toISOString(),msg: err});
        }
      });

      router.get('/my', function (req, res) {
        db.collection("roles").findOne({
          "_id": req.headers["X-User"]
        }, function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else if (result) {
            res.status(200).send({
              result: "success",
              data: result
            })
          } else {
            res.status(404).send({
              result: "failure",
              error: "role not found"
            })
          }
        });
      });

      // Worker
      router.use(function (req, res, next) {
        db.collection("roles").findOne({
          "_id": req.headers["X-User"],
          roles: {
            $all: ['worker']
          }
        }, function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else if (result) {
            next();
          } else {
            res.status(403).send({
              result: "failure",
              message: "user is not a worker",
              error: err
            })
          }
        });
      });

      router.get('/all', function (req, res) {
        db.collection("roles").find({}).toArray(function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else {
            res.status(200).send({
              result: "success",
              data: result
            });
          }
        });
      });

      router.get('/:uid', function (req, res) {
        db.collection("roles").findOne({
          "_id": req.params.uid
        }, function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else if (result) {
            res.status(200).send({
              result: "success",
              data: result
            })
          } else {
            res.status(404).send({
              result: "failure",
              message: "role not found"
            })
          }
        });
      });

      router.put('/:uid', function (req, res) {
        var data = {
          "_id": req.params.uid,
          roles: req.body.roles
        }
        db.collection("roles").update({
          "_id": req.params.uid
        }, data, {
          upsert: true
        }, function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else {
            res.status(202).send({
              result: "success",
              message: "role updated"
            })
          }
        });
      });
    })
    .catch(console.error)

  return router;
}