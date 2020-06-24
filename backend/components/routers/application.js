const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

module.exports = function (config) {

  MongoClient.connect(config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      const db = client.db('stva');

      // , { projection: { _id: 0 } }
      router.get('/my/all', function (req, res, next) {
        db.collection("applications").find({
          "uid": req.headers["X-User"]
        }).sort( { timestamp: -1 } ).toArray(function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure"
            });
          } else if(result) {
            res.status(200).send({
              result: "success",
              data: result
            });
          } else {
            res.status(404).send({
              result: "failure",
              message: "no result from database"
            });
          }
        });
      });

      router.put('/my', function (req, res, next) {
        var data = {
          uid: req.headers["X-User"],
          type: req.body.type, // "plate", // "license" or "badge"
          plateId: req.body.plateId, // "SC AB 1234",
          text: req.body.text, // "Ich will ein kennzeichen beantragen",
          status: "open", // "denied" or "accepted",
          timestamp: Date.now()
        }

        db.collection("applications").insertOne(data, function (err, result) {
          if (err) {
            res.status(501).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else {
            res.status(201).send({
              result: "success",
              message: "application created: " + result.insertedId
            })
          }
        });
      });
      
      router.get('/my/:id', function (req, res, next) {
        db.collection("applications").findOne({
          "_id": ObjectId(req.params.id),
          "uid": req.headers["X-User"]
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
              message: "application not found"
            })
          }
        });
      });
      
      router.put('/my/:id', function (req, res, next) {
        var update = {
          $set: {
            text: req.body.text,
            timestamp: Date.now()
          }
        }

        if(req.body.status && req.body.status === "closed"){
          console.log("status closed")
          update.$set['status'] = 'closed'
        }

        db.collection("applications").updateOne({
          "_id": ObjectId(req.params.id),
          "uid": req.headers["X-User"]
        }, update, function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else if(result.result.nModified == 1) {
            res.status(202).send({
              message: "success"
            })
          } else {
            res.status(404).send({
              result: "failure",
              message: "application not found or not owned by user " + req.headers["X-User"]
            });
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
              message: "failure",
              error: "database error"
            });
          } else if (result) {
            next();
          } else {
            res.status(403).send({
              message: "failure",
              error: "user is not a worker"
            })
          }
        });
      });
      
      router.get('/all', function (req, res, next) {
        db.collection("applications").find({}).sort( { timestamp: -1 } ).toArray(function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure"
            });
          } else if(result) {
            res.status(200).send({
              result: "success",
              data: result
            });
          } else {
            res.status(404).send({
              result: "failure",
              message: "no result from database"
            });
          }
        });
      });
      
      router.get('/all/open', function (req, res, next) {
        db.collection("applications").find({
          status: "open"
        }).sort( { timestamp: -1 } ).toArray(function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure"
            });
          } else if(result) {
            res.status(200).send({
              result: "success",
              data: result
            });
          } else {
            res.status(404).send({
              result: "failure",
              message: "no result from database"
            });
          }
        });
      });
      
      router.get('/:id', function (req, res, next) {
        db.collection("applications").findOne({
          "_id": ObjectId(req.params.id)
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
              message: "application not found"
            })
          }
        });
      });
      
      router.put('/:id', function (req, res, next) {
        var update = {
          $set: req.body
        }

        update.$set['timestamp'] = Date.now()

        db.collection("applications").updateOne({
          "_id": ObjectId(req.params.id)
        }, update, function (err, result) {
          if (err) {
            res.status(500).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else if(result.result.nModified == 1) {
            res.status(202).send({
              message: "success"
            })
          } else {
            res.status(404).send({
              result: "failure",
              message: "application not found"
            });
          }
        });
      });

    })
    .catch(console.error)

  return router;
}