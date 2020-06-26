const amqplib = require('amqplib');

let channel = null;
let exchange = null;

exports.initialize = (config) => {
    console.log(config)

    exchange = config.RABBITMQ_EXCHANGE;
    var connection = amqplib.connect(config.RABBITMQ_CONNECTION);

    // Publisher
    connection.then((conn) => {
        return conn.createChannel();
    }).then((ch) => {
        channel = ch;

        channel.assertExchange(exchange, 'fanout', {
            durable: true
        })

        return channel;
    }).catch(console.warn);
}

exports.publishToExchange = (routingKey, data) => {
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)));
};