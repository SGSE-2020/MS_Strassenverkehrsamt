const amqplib = require('amqplib');

let channel = null;
let exchange = null;
let db = null;

exports.initialize = (config, databaseService) => {
    db = databaseService;
    exchange = config.RABBITMQ_EXCHANGE;
    var connection = amqplib.connect(config.RABBITMQ_CONNECTION);

    // Publisher
    connection.then((conn) => {
        return conn.createChannel();
    }).then((ch) => {
        channel = ch;

        channel.assertExchange(exchange, 'fanout', {
            durable: true
        });
        
        channel.assertQueue(config.RABBITMQ_QUEUE).then((ok) => {
            return channel.consume(config.RABBITMQ_QUEUE, (msg) =>{
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
                }
            });
        });

        return channel;
    }).catch(console.warn);
}

exports.publishToExchange = (routingKey, data) => {
    console.log("outgoing: " + JSON.stringify(data))
    channel.publish(exchange, routingKey, Buffer.from(data));
    db.log('outgoing-msg', JSON.stringify(data));
};