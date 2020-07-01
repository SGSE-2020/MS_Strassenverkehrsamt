const amqplib = require('amqplib');
const caller = require('grpc-caller');
const path = require('path');

let channel = null;
let exchange = null;
let db = null;

exports.initialize = (config, databaseService) => {
    db = databaseService;
    exchange = config.RABBITMQ_EXCHANGE;
    var connection = amqplib.connect(config.RABBITMQ_CONNECTION);

    const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
    const grpcClient = caller('ms-buergerbuero:' + config.PORT_GRPC, userProtoPath, 'UserService');

    connection.then((conn) => {
        return conn.createChannel();
    }).then((ch) => {
        channel = ch;

        channel.assertExchange(exchange, 'fanout', {
            durable: true
        });

        channel.assertQueue(config.RABBITMQ_QUEUE).then((ok) => {
            return channel.consume(config.RABBITMQ_QUEUE, (msg) => {
                if (msg !== null) {
                    console.log("incomeing: " + msg.content.toString())
                    channel.ack(msg);
                    db.log('incomeing-msg', msg.content.toString());

                    const dbMsg = {
                        fields: msg.fields,
                        properties: msg.properties,
                        content: msg.content.toString(),
                        timestamp: Date.now()
                    }

                    db.getDB().collection("messages").insertOne(dbMsg, function (err, result) {
                        if (err) {
                            console.log("error inserting incoming message into database")
                        }
                    });

                    if (msg.fields.exchange == "buergerbuero" && msg.fields.routingKey == "daten.geaendert") {
                        var msgJSON = JSON.parse(dbMsg.content);

                        grpcClient.getUser({
                                uid: msgJSON.uid
                            })
                            .then(resultAccount => {
                                var update = {
                                    $set: {
                                        firstName: resultAccount.firstName,
                                        lastName: resultAccount.lastName,
                                        nickName: resultAccount.nickName,
                                        email: resultAccount.email,
                                        birthDate: resultAccount.birthDate,
                                        image: resultAccount.image
                                    }
                                }

                                databaseService.getDB().collection("accounts").updateOne({
                                    "_id": msgJSON.uid
                                }, update, function (err, resultDBUpdateAccount) {
                                    if (err) {
                                        databaseService.log('user-updated', {
                                            result: "failure",
                                            uid: msgJSON.uid,
                                            error: err
                                        });
                                    } else {
                                        databaseService.log('user-updated', {
                                            result: "success",
                                            uid: msgJSON.uid
                                        });
                                    }
                                });
                            }).catch(err => {
                                databaseService.log('user-updated', {
                                    result: "failure",
                                    uid: msgJSON.uid,
                                    error: err
                                });
                            })
                    }
                }
            });
        });

        console.log("Message service started!");
        return channel;
    }).catch(console.warn);
}

exports.publishToExchange = (routingKey, data) => {
    console.log("outgoing: " + JSON.stringify(data))
    channel.publish(exchange, routingKey, Buffer.from(data));
    db.log('outgoing-msg', JSON.stringify(data));
};