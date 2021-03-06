const router = require('express').Router();

module.exports = function (config, messageService, databaseService) {

  router.get('/all', function (req, res) {
    var query = {};
    databaseService.getDB().collection("accounts").find(query, {
      projection: {
        plates: 1
      }
    }).toArray(function (err, result) {
      if (err) {
        res.status(501).send({
          message: "failure"
        });
      } else {
        var plateList = []

        if (result)
          result.forEach(account => {
            if (account.plates)
              account.plates.forEach(plate => {
                plateList.push(plate)
              });
          });

        res.status(200).send({
          message: "success",
          result: plateList
        });
      }
    });
  });

  router.get('/:plateid', function (req, res) {
    res.send(req.params.plateid);
  });

  router.put('/:plateid', function (req, response) {
    var plate = {
      uid: req.params.plateid,
      validUntil: {
        year: 2022,
        month: 07,
        day: 01
      },
      isValid: true
    }

    databaseService.getDB().collection("licenseplates").insertOne(plate, function (err, res) {
      if (err) {
        response.send('Error registering licenseplate with id ' + req.params.plateid);
      } else {
        response.send('Licenseplate with id ' + req.params.plateid + ' successfully registerd!');
      }
    });
  });

  return router;
}