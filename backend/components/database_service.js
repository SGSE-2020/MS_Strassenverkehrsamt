var MongoClient = require('mongodb').MongoClient;

let database = null;

exports.initialize = (config) => {
    MongoClient.connect(config.mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(client => {
        database = client.db(config.MONGODB_DATABASE);
    })
    .catch(console.error)  
}

exports.getDB = () => {
    return database;
};