const router = require('express').Router();
const path = require('path');
const caller = require('grpc-caller')

module.exports = function (config, messageService, databaseService) {
  const announcementProtoPath = path.resolve(__dirname, '../../proto/announcement.proto');
  const grpcClient = caller('ms-buergerbuero:' + config.PORT_GRPC, announcementProtoPath, 'AnnouncementService');

  // Worker
  router.use(function (req, res, next) {
    databaseService.getDB().collection("roles").findOne({
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
    databaseService.getDB().collection("announcement").find({}).toArray(function (err, result) {
      if (err) {
        res.status(501).send({
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

  router.put('/new', function (req, res) {
    var data = {
      title: req.body.title,
      text: req.body.text,
      image: undefined,
      service: "Straßenverkehrsamt"
    }

    grpcClient.sendAnnouncement(data)
      .then(result => {
        databaseService.getDB().collection("announcement").insertOne(result, function (err, result) {
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

            messageService.publishToExchange("", {
              origin: "ms-strassenverkehrsamt",
              event: {
                type: "announcement",
                content: {
                  titel: data.title,
                  text: data.text
                }
              }
            })
          }
        });
      }).catch(err => {
        console.error(err)
        databaseService.getDB().collection("log").insertOne({
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
        databaseService.getDB().collection("log").insertOne({
          type: 'grpc-deleteAnnouncement-status',
          timestamp: new Date().toISOString(),
          msg: result
        });
        databaseService.getDB().collection("announcement").deleteOne({
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
        databaseService.getDB().collection("log").insertOne({
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

  return router;
}