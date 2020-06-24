const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const path = require('path');
const caller = require('grpc-caller')

module.exports = function (config) {
  const announcementProtoPath = path.resolve(__dirname, '../../proto/announcement.proto');
  const grpcClient = caller('ms-buergerbuero:' + config.PORT_GRPC, announcementProtoPath, 'AnnouncementService');

  MongoClient.connect(config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      const db = client.db('stva');

      // Worker
      router.use(function (req, res, next) {
        db.collection("roles").findOne({
          "_id": req.headers["X-User"],
          roles: {
            $all: ['worker']
          }
        }, function (err, result) {
          if (err) {
            res.status(501).send({
              result: "failure",
              message: "database error",
              error: err
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

      router.get('/all', function (req, res) {
        db.collection("announcement").find({}).toArray(function (err, result) {
          if (err) {
            res.status(501).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else {
            res.status(200).send({
              result: "success",
              message: result
            });
          }
        });
      });

      router.put('/new', function (req, res) {
        var data = {
          title: req.body.title,
          text: req.body.text,
          image: undefined,
          service: "Straßenverkehrsamt"
        }

        grpcClient.sendAnnouncement(data)
          .then(result => {
            db.collection("announcement").insertOne(result, function (err, result) {
              if (err) {
                res.status(501).send({
                  result: "failure",
                  message: "database error",
                  error: err
                });
              } else {
                res.status(200).send({
                  result: "success",
                  message: "announcement created"
                })
              }
            });
          }).catch(err => {
            console.error(err)
            db.collection("log").insertOne({
              type: 'grpc-catch',
              timestamp: new Date().toISOString(),
              msg: err
            });
            res.status(500).send({
              result: "failure",
              message: "grpc error",
              error: JSON.stringify(err),
              position: "grpc catch"
            })
          })
      });

      router.delete('/:id', function (req, res) {
        grpcClient.deleteAnnouncement({
            id: req.params.id,
            service: "Straßenverkehrsamt"
          })
          .then(result => {
            db.collection("log").insertOne({
              type: 'grpc-deleteAnnouncement-status',
              timestamp: new Date().toISOString(),
              msg: result
            });
            db.collection("announcement").deleteOne({
              id: req.params.id
            }, function (err, result) {
              if (err) {
                res.status(501).send({
                  result: "failure",
                  message: "database error",
                  error: err
                });
              } else {
                res.status(200).send({
                  result: "success",
                  message: 'announcement "' + req.params.id + '" deleted from database'
                })
              }
            });
          }).catch(err => {
            console.error(err)
            db.collection("log").insertOne({
              type: 'grpc-catch',
              timestamp: new Date().toISOString(),
              msg: err
            });
            res.status(500).send({
              result: "failure",
              message: "grpc error",
              error: JSON.stringify(err),
              position: "grpc catch"
            })
          })
      });
    })
    .catch(console.error)

  return router;
}