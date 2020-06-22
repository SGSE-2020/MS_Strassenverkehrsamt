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

      // User self
      router.get('/my', function (req, res, next) {
        console.log(req.headers["X-User"])

        // Check if account exists
        var query = {
          uid: req.headers["X-User"]
        };
        db.collection("accounts").findOne(query, function (err, result) {
          if (err) {
            res.status(501).send({
              message: "internal error"
            });
            throw err;
          }

          if (result) {
            res.status(200).send({
              message: "user found",
              result: result
            });
          } else {
            db.collection("accounts").insertOne({
              "uid": req.headers["X-User"]
            }, function (err, result) {
              if (err) {
                res.status(501).send('internal error');
                throw err;
              }

              res.status(201).send({
                message: "user created"
              });
            });
          }


        });
      });

      router.put('/my', function (req, res, next) {
        var data = {
          uid: req.params.uid,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          nickname: req.body.nickname,
          email: req.body.email,
          birthday: req.body.birthday
        }
        db.collection("roles").update({
          uid: req.params.uid
        }, data, {
          upsert: true
        }, function (err, result) {
          if (err) {
            res.status(501).send({
              message: "failure",
              error: "database error"
            });
          } else {
            res.status(202).send({
              message: "success"
            })
          }
        });
      });

      // Worker
      router.use(function (req, res, next) {
        db.collection("roles").findOne({
          uid: req.headers["X-User"],
          roles: {
            $all: ['worker']
          }
        }, function (err, result) {
          if (err) {
            res.status(501).send({
              message: "failure",
              error: "database error"
            });
            throw err;
          }

          if (result) {
            next();
          } else {
            res.status(403).send({
              message: "failure",
              error: "user is not a worker"
            })
          }
        });
      });

      router.get('/:uid', function (req, res, next) {
        db.collection("accounts").findOne({
          uid: req.params.uid
        }, function (err, result) {
          if (err) {
            res.status(501).send({
              message: "failure",
              error: "database error"
            });
            throw err;
          }

          if (result) {
            res.status(200).send({
              message: "success",
              result: result
            })
          } else {
            res.status(404).send({
              message: "failure",
              error: "user not found"
            })
          }
        });
      });

      router.put('/:uid', function (req, res, next) {
        var data = {
          uid: req.params.uid,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          nickname: req.body.nickname,
          email: req.body.email,
          birthday: req.body.birthday
        }
        db.collection("roles").update({
          uid: req.params.uid
        }, data, {
          upsert: true
        }, function (err, result) {
          if (err) {
            res.status(501).send({
              message: "failure",
              error: "database error"
            });
          } else {
            res.status(202).send({
              message: "success"
            })
          }
        });
      });
    })
    .catch(console.error)

  return router;
}