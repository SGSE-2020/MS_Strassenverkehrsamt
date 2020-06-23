const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
const caller = require('grpc-caller')
const path = require('path');

module.exports = function (config) {
  const userProtoPath = path.resolve(__dirname, '../../proto/user.proto');
  const grpcClient = caller('ms-buergerbuero:' + config.PORT_GRPC, userProtoPath, 'UserService');

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
          "_id": req.headers["X-User"]
        };
        db.collection("accounts").findOne(query, function (err, result) {
          if (err) {
            res.status(501).send({
              result: "failure",
              message: "database error",
              error: err
            });
            throw err;
          }

          if (result) {
            res.status(200).send({
              result: "success",
              message: "user found",
              data: result
            });
          } else {
            grpcClient.getUser({
              uid: req.headers["X-User"]
            })
            .then(result => {
              db.collection("accounts").insertOne({
                "_id": req.headers["X-User"],
                "firstName": result.firstName,
                "lastName": result.lastName,
                "nickName": result.nickName,
                "email": result.email,
                "birthDate": result.birthDate
              }, function (err, result) {
                if (err) {
                  res.status(501).send({
                    result: "failure",
                    message: "database error",
                    error: err
                  });
                  throw err;
                } else {
                  // Create role for user
                  db.collection("roles").insertOne({
                    "_id": req.headers["X-User"],
                    "roles": ['user']
                  }, function (err, result) {
                    if (err) {
                      res.status(501).send({
                        result: "failure",
                        message: "database error",
                        error: err
                      });
                    } else {
                      res.status(201).send({
                        result: "success",
                        message: "user created"
                      });
                    }
                  });
                }
              });

              db.collection("log").insertOne({type: 'grpc-res', timestamp: new Date().toISOString(), msg: result});
            }).catch(err => {
              console.error(err)
              db.collection("log").insertOne({ type: 'grpc-catch', timestamp: new Date().toISOString(), msg: err});
              res.status(500).send({
                  position: "grpc catch",
                  error: JSON.stringify(err)
              })
            })
          }
        });
      });

      router.put('/my', function (req, res, next) {
        var data = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          nickname: req.body.nickname,
          email: req.body.email,
          birthday: req.body.birthday
        }
        db.collection("accounts").update({
          "_id": req.params.uid
        }, data, {
          upsert: true
        }, function (err, result) {
          if (err) {
            res.status(501).send({
              result: "failure",
              message: "database error",
              error: err
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
            throw err;
          }

          if (result) {
            next();
          } else {
            res.status(403).send({
              result: "failure",
              message: "user is not a worker"
            })
          }
        });
      });

      router.get('/:uid', function (req, res, next) {
        db.collection("accounts").findOne({
          "_id": req.params.uid
        }, function (err, result) {
          if (err) {
            res.status(501).send({
              result: "failure",
              message: "database error",
              error: err
            });
            throw err;
          }

          if (result) {
            res.status(200).send({
              result: "success",
              data: result
            })
          } else {
            res.status(404).send({
              result: "failure",
              message: "user not found"
            })
          }
        });
      });

      router.put('/:uid', function (req, res, next) {
        var data = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          nickname: req.body.nickname,
          email: req.body.email,
          birthday: req.body.birthday
        }
        db.collection("accounts").update({
          "_id": req.params.uid
        }, data, {
          upsert: true
        }, function (err, result) {
          if (err) {
            res.status(501).send({
              result: "failure",
              message: "database error",
              error: err
            });
          } else {
            console.log(result)
            res.status(202).send({
              result: "success",
              message: "user updated"
            })
          }
        });
      });
    })
    .catch(console.error)

  return router;
}