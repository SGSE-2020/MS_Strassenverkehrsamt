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

        /*
        channel.assertExchange(exchange, 'fanout', {
            durable: true
        });
        */
        
        channel.assertQueue(config.RABBITMQ_QUEUE).then((ok) => {
            return channel.consume(config.RABBITMQ_QUEUE, (msg) =>{
                if (msg !== null) {
                    console.log("incomeing: " + msg.content.toString())
                    channel.ack(msg);
                    db.getDB().collection("log").insertOne({type: 'incomeing-msg', timestamp: new Date().toISOString(), msg: msg.content.toString()});
                }
            });
        });

        return channel;
    }).catch(console.warn);
}

exports.publishToExchange = (routingKey, data) => {
    console.log("outgoing: " + JSON.stringify(data))
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)));
    db.getDB().collection("log").insertOne({type: 'outgoing-msg', timestamp: new Date().toISOString(), msg: JSON.stringify(data)});
};