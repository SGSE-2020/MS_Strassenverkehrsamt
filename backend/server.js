var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/hello', function (req, res) {
  res.send({somedata: ['Hallo', 'dies', 'sind', 'daten', 'aus', 'der', 'API']});
});

app.listen(3500, function () {
  console.log('MS_Strassenverkehrsamt API listening on port 3500!');
});
