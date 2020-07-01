const router = require('express').Router();
const caller = require('grpc-caller')
const path = require('path');

module.exports = function (config, messageService, databaseService) {
  const userProtoPath = path.resolve(__dirname, '../../proto/user.proto');
  const grpcClient = caller('ms-buergerbuero:' + config.PORT_GRPC, userProtoPath, 'UserService');

  // User self
  router.get('/my', function (req, res, next) {
    console.log(req.headers["X-User"])

    // Check if account exists
    var query = {
      "_id": req.headers["X-User"]
    };
    databaseService.getDB().collection("accounts").findOne(query, function (err, result) {
      if (err) {
        res.status(500).send({
          result: "failure",
          message: "database error, finding account",
          error: err
        });
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
            databaseService.getDB().collection("accounts").insertOne({
              "_id": req.headers["X-User"],
              "firstName": result.firstName,
              "lastName": result.lastName,
              "nickName": result.nickName,
              "email": result.email,
              "birthDate": result.birthDate,
              "image": result.image
            }, function (err, resultInsertAccount) {
              if (err) {
                res.status(500).send({
                  result: "failure",
                  message: "database error, inserting account",
                  error: err
                });
              } else {
                // Create role for user
                databaseService.getDB().collection("roles").insertOne({
                  "_id": req.headers["X-User"],
                  "roles": ['user']
                }, function (err, resultInsertRole) {
                  if (err) {
                    res.status(500).send({
                      result: "failure",
                      message: "database error, inserting role",
                      error: err
                    });
                  } else {
                    res.status(201).send({
                      result: "success",
                      message: "user and role created",
                      data: resultInsertAccount.ops[0]
                    });
                  }
                });
              }
            });

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
      }
    });
  });

  router.put('/my', function (req, res, next) {
    var data = {
      $set: req.body
    }
    delete data.$set['license'];
    delete data.$set['plates'];

    databaseService.getDB().collection("accounts").update({
      "_id": req.headers["X-User"]
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
          message: "success"
        })
      }
    });
  });

  // Worker
  router.use(function (req, res, next) {
    databaseService.getDB().collection("roles").findOne({
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
    databaseService.getDB().collection("accounts").findOne({
      "_id": req.params.uid
    }, function (err, result) {
      if (err) {
        res.status(500).send({
          result: "failure",
          message: "database error",
          error: err
        });
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
      $set: req.body
    }

    databaseService.getDB().collection("accounts").update({
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
        console.log(result)
        res.status(202).send({
          result: "success",
          message: "user updated"
        })
      }
    });
  });

  return router;
}