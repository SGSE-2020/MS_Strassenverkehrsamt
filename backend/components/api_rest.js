const express = require("express");
const bodyParser = require('body-parser');

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

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.get('/hello', function (req, res) {
        res.send({
            somedata: ['Hallo', 'dies', 'sind', 'daten', 'aus', 'der', 'API']
        });
    });

    app.listen(config.PORT_REST, function () {
        console.log('MS_Strassenverkehrsamt API listening on port ' + config.PORT_REST);
    });
}