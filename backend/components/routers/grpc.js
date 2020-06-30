const router = require('express').Router();
const path = require('path');
const caller = require('grpc-caller');

module.exports = function (config, messageService, databaseService) {
    const driverslicenseProtoPath = path.resolve(__dirname, '../../proto/driverslicense.proto');
    const licenseplateProtoPath = path.resolve(__dirname, '../../proto/licenseplate.proto');
    const grpcClientDriversLicense = caller('ms-strassenverkehrsamt:' + config.PORT_GRPC, driverslicenseProtoPath, 'DriversLicenseService');
    const grpcClientLicensePlate = caller('ms-strassenverkehrsamt:' + config.PORT_GRPC, licenseplateProtoPath, 'LicensePlateService');

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

        databaseService.getDB().collection("log").insertOne({type: 'grpc-res', timestamp: new Date().toISOString(), msg: result});
      }).catch(err => {
        console.error(err)
        databaseService.getDB().collection("log").insertOne({ type: 'grpc-catch', timestamp: new Date().toISOString(), msg: err});
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

        databaseService.getDB().collection("log").insertOne({type: 'grpc-res', timestamp: new Date().toISOString(), msg: result});
      }).catch(err => {
        console.error(err)
        databaseService.getDB().collection("log").insertOne({ type: 'grpc-catch', timestamp: new Date().toISOString(), msg: err});
        res.status(500).send({
          position: "grpc catch",
          error: JSON.stringify(err)
        })
      })
  });

  return router;
}