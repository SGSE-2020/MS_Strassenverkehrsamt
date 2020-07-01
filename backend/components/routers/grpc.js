const router = require('express').Router();
const path = require('path');
const caller = require('grpc-caller');

module.exports = function (config, messageService, databaseService) {
  const driverslicenseProtoPath = path.resolve(__dirname, '../../proto/driverslicense.proto');
  const licenseplateProtoPath = path.resolve(__dirname, '../../proto/licenseplate.proto');
  const grpcClientDriversLicense = caller('ms-strassenverkehrsamt:' + config.PORT_GRPC, driverslicenseProtoPath, 'DriversLicenseService');
  const grpcClientLicensePlate = caller('ms-strassenverkehrsamt:' + config.PORT_GRPC, licenseplateProtoPath, 'LicensePlateService');

  const announcementProtoPath = path.resolve(__dirname, '../../proto/announcement.proto');
  const grpcClientAnnouncement = caller('ms-buergerbuero:' + config.PORT_GRPC, announcementProtoPath, 'AnnouncementService');

  router.get('/alive', function (req, res) {
    res.send("alive")
  });

  router.get('/driverslicense/:uid', function (req, res) {
    grpcClientDriversLicense.getLicense({
        uid: req.params.uid
      })
      .then(result => {
        if (result) {
          res.status(200).send(result)
        } else {
          res.status(500).send({
            result: "failure",
            message: "internal error"
          })
        }

        databaseService.getDB().collection("log").insertOne({
          type: 'grpc-res',
          timestamp: new Date().toISOString(),
          msg: result
        });
      }).catch(err => {
        console.error(err)
        databaseService.getDB().collection("log").insertOne({
          type: 'grpc-catch',
          timestamp: new Date().toISOString(),
          msg: err
        });
        res.status(500).send({
          position: "grpc catch",
          error: JSON.stringify(err)
        })
      })
  });

  router.get('/licenseplate/:id', function (req, res) {
    grpcClientLicensePlate.getLicensePlate({
        id: req.params.id
      })
      .then(result => {
        if (result) {
          res.status(200).send(result)
        } else {
          res.status(500).send({
            result: "failure",
            message: "internal error"
          })
        }

        databaseService.getDB().collection("log").insertOne({
          type: 'grpc-res',
          timestamp: new Date().toISOString(),
          msg: result
        });
      }).catch(err => {
        console.error(err)
        databaseService.getDB().collection("log").insertOne({
          type: 'grpc-catch',
          timestamp: new Date().toISOString(),
          msg: err
        });
        res.status(500).send({
          position: "grpc catch",
          error: JSON.stringify(err)
        })
      })
  });

  router.post('/announcement', function (req, res) {
    var data = {
      title: req.body.title,
      text: req.body.text,
      image: undefined,
      service: req.body.service
    }

    grpcClientAnnouncement.sendAnnouncement(data)
      .then(result => {
        databaseService.getDB().collection("announcement").insertOne(result, function (err, resultAnnouncement) {
          if (err) {
            databaseService.getDB().log('announcement-send-error', {
              result: "failure",
              message: "database error",
              error: err
            });
            res.status(500).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else {
            databaseService.getDB().log('announcement-send', {
              result: "success",
              message: "announcement created"
            });
            res.status(200).send({
              result: "success",
              message: "announcement created",
              announcement: resultAnnouncement
            })
          }
        });
      }).catch(err => {
        databaseService.getDB().log('announcement-send-catch', {
          type: 'grpc-catch',
          timestamp: new Date().toISOString(),
          msg: err
        });
        res.status(500).send({
          result: "failure",
          message: "grpc-catch",
          error: err
        });
      })
  });

  return router;
}