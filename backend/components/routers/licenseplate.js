const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;

module.exports = function (config) {

  MongoClient.connect(config.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(client => {
      const db = client.db('stva');

      router.get('/all', function (req, res) {
        var query = {};
        db.collection("licenseplates").find(query).toArray(function (err, result) {
          if (err) {
            res.status(501).send({
              message: "failure"
            });
            throw err;
          }
          res.status(200).send({
            message: "success",
            result: result
          });
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

        db.collection("licenseplates").insertOne(plate, function (err, res) {
          if (err) {
            response.send('Error registering licenseplate with id ' + req.params.plateid);
            throw err;
          }
          response.send('Licenseplate with id ' + req.params.plateid + ' successfully registerd!');
        });

        //res.send(req.params.plateid);
      });
    })
    .catch(console.error)

  return router;
}