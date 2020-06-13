const express = require("express");
const bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var mongodbURL = "mongodb://localhost:27017/";

const app = express();

module.exports = function (config) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(function (req, res, next) {
        console.log(req.method + " " + req.url);
        next();
    });

    app.get('/alive', function (req, res) {
        res.send({
            status: "alive"
        });
    });

    MongoClient.connect(mongodbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(client => {
            const db = client.db('stva')

            app.get('/licenseplate/all', function (req, res) {
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

            app.get('/licenseplate/:plateid', function (req, res) {
                res.send(req.params.plateid);
            });

            app.put('/licenseplate/:plateid', function (req, response) {
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

            app.get('/mongo', function (req, res) {
                var acc = {
                    "id": 1234,
                    "name": "max"
                }

                db.collection("accounts").insertOne(acc, function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                });

                res.send('hello mongodb');
            });

            app.get('/', function (req, res) {
                res.send('Hello World!');
            });

            app.get('/hello', function (req, res) {
                res.type('application/json');
                res.send({
                    somedata: ['Hallo', 'dies', 'sind', 'daten', 'aus', 'der', 'API']
                });
            });
        })
        .catch(console.error)

    app.listen(config.PORT_REST, function () {
        console.log('MS_Strassenverkehrsamt API listening on port ' + config.PORT_REST);
    });
}