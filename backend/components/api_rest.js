const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const caller = require('grpc-caller')

const app = express();
var MongoClient = require('mongodb').MongoClient;

var envType = process.env.NODE_ENV;
if(envType == "development"){
    console.log("API running in development mode. No authentication required!")
}

module.exports = function (config, messageService, databaseService) {
    const accountsRouter = require('./routers/account')(config);
    const rolesRouter = require('./routers/roles')(config);
    const announcementsRouter = require('./routers/announcement')(config);
    const applicationsRouter = require('./routers/application')(config);
    const licenseplatesRouter = require('./routers/licenseplate')(config);
    const messagesRouter = require('./routers/messages')(config, messageService, databaseService);

    const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
    const grpcClient = caller('ms-buergerbuero:' + config.PORT_GRPC, userProtoPath, 'UserService');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.get('/alive', function (req, res) {
        const data = {
            message: '/alive',
            timestamp: Date.now()
        };

        if (messageService != undefined && messageService != null) {
            messageService.publishToExchange("test-routing-key", JSON.stringify(data));
        }

        res.send({
            status: "alive"
        });
    });

    MongoClient.connect(config.mongodbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(client => {
            // MongoDB Setup
            const db = client.db('stva');

            /*
            db.collection("log").drop(function(err, delOK) {
                if (delOK) console.log("Log Collection deleted");
            });
            */

            // Logging
            app.get('/log/all', function (req, res) {
                db.collection("log").find({}).sort({timestamp: -1}).toArray(function (err, result) {
                    if (err) {
                        res.status(501).send({
                            message: "failure"
                        });
                    } else {
                        res.status(200).send({
                            message: "success",
                            result: result
                        });
                    }
                });
            });

            app.delete('/resetdb', function (req, res) {
                db.collection("accounts").deleteMany({}, function (err, result) {
                    if (err) {
                        console.log("error deleteing accounts")

                        db.collection("accounts").insertOne({
                            "_id": "NqDh0ZKMVwXyVBgowVa088QKr7I2",
                            "firstName": "Fritz",
                            "lastName": "Meier",
                            "nickName": "Fritzy",
                            "email": "fritz.meier@example.com",
                            "birthDate": "12.6.1991"
                          }, function (err, result) {
                            if (err) {
                                console.log("error readding init worker account")
                            } else {
                                console.log("success readding init worker account")
                            }
                          });
                    } else {
                        console.log("success deleteing accounts")
                    }
                });

                db.collection("roles").deleteMany({}, function (err, result) {
                    if (err) {
                        console.log("error deleteing roles")
                    } else {
                        console.log("success deleteing roles")

                        var data = {
                            "_id": 'NqDh0ZKMVwXyVBgowVa088QKr7I2',
                            roles: ['user', 'worker']
                        }
                        db.collection("roles").update({
                            "_id": data._id
                        }, data, {
                            upsert: true
                        }, function (err, result) {
                            if (err) {
                                console.log("error readding init worker")
                            } else {
                                console.log("success readding init worker")
                            }
                        });
                    }
                });

                db.collection("announcement").deleteMany({}, function (err, result) {
                    if (err) {
                        console.log("error deleteing announcement")
                    } else {
                        console.log("success deleteing announcement")
                    }
                });

                db.collection("applications").deleteMany({}, function (err, result) {
                    if (err) {
                        console.log("error deleteing applications")
                    } else {
                        console.log("success deleteing applications")
                    }
                });

                res.status(200).send('ok');
            });

            // Auth
            if(envType != "development"){
                app.use(function (req, res, next) {
                    console.log(req.method + " " + req.url);

                    if (!req.headers.authorization) {
                        return res.status(401).json({
                            error: 'No credentials sent!'
                        });
                    } else {
                        try {
                            grpcClient.verifyUser({
                                    token: req.headers.authorization
                                })
                                .then(result => {
                                    res.type('application/json');
                                    if (result.uid) {
                                        req.headers["X-User"] = result.uid;
                                        next();
                                    } else {
                                        res.status(401).send({
                                            error: 'Invalid token!'
                                        });
                                    }

                                    db.collection("log").insertOne({type: 'grpc-res', timestamp: new Date().toISOString(), msg: result});
                                }).catch(err => {
                                    console.error(err)
                                    db.collection("log").insertOne({ type: 'grpc-catch', timestamp: new Date().toISOString(), msg: err});
                                    res.status(500).send({
                                        position: "grpc catch",
                                        error: JSON.stringify(err)
                                    })
                                })
                        } catch (e) {
                            db.collection("log").insertOne({type: 'grpc-catch-all',timestamp: new Date().toISOString(),msg: e});
                            res.status(500).send({
                                position: "catch",
                                error: JSON.stringify(e)
                            })
                        }
                    }
                });
            } else {
                app.use(function (req, res, next) {
                    console.log(req.method + " " + req.url);

                    req.headers["X-User"] = "NqDh0ZKMVwXyVBgowVa088QKr7I2";
                    next();
                });
            }
            
            app.use('/account', accountsRouter);
            app.use('/roles', rolesRouter);
            app.use('/announcements', announcementsRouter);
            app.use('/applications', applicationsRouter);
            app.use('/licenseplates', licenseplatesRouter);
            app.use('/messages', messagesRouter);
        })
        .catch(console.error)    

    app.listen(config.PORT_REST, function () {
        console.log('MS_Strassenverkehrsamt API listening on port ' + config.PORT_REST);
    });
}