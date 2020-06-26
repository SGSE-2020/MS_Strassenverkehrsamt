const amqplib = require('amqplib');
const express = require("express");
const bodyParser = require('body-parser');

module.exports = function (config) {
    const msgApp = express();
    msgApp.use(bodyParser.json());
    msgApp.use(bodyParser.urlencoded({
        extended: true
    }));

    var queue = 'development';
    var exchange = 'test';
    var connection = amqplib.connect('amqp://localhost');

    // Consumer
    connection.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        return ch.assertQueue(queue).then(function (ok) {
            return ch.consume(queue, function (msg) {
                if (msg !== null) {
                    console.log("Incoming: " + msg.content.toString());
                    ch.ack(msg);
                }
            });
        });
    }).catch(console.warn);

    // Publisher
    connection.then((conn) => {
        return conn.createChannel();
    }).then((ch) => {
        ch.assertExchange(exchange, 'fanout', {
            durable: true
        })
        return ch.assertQueue(queue).then((ok) => {
            ch.sendToQueue(queue, Buffer.from('Startup'));

            msgApp.post('/msg', function (req, res) {
                const msg = {
                    message: req.body,
                    timestamp: Date.now()
                }

                ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                res.send({
                    result: "Message send",
                    message: msg
                });
            });

            msgApp.listen(3700, function () {
                console.log('msgApp listening on port ' + 3700);
            });
        });
    }).catch(console.warn);

}