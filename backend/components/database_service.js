var MongoClient = require('mongodb').MongoClient;

let database = null;

exports.initialize = (config) => {
    MongoClient.connect(config.mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(client => {
        database = client.db(config.MONGODB_DATABASE);
        console.log("Database service started!");
    })
    .catch(console.error)  
}

exports.getDB = () => {
    return database;
};

exports.log = (type, msg) => {
    database.collection("log").insertOne({type: type, timestamp: new Date().toISOString(), msg: msg});
};