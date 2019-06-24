import MongoClient from 'mongoose';

import Defines from './../../config';

let host = Defines.MONGO_HOST;
let port = Defines.MONGO_PORT;
let database = Defines.MONGO_DB;

let client = MongoClient.createConnection(`mongodb://${host}:${port}/${database}`, { autoReconnect: true })

client.on('connected', () => {
    console.log(`connected to  mongodb://${host}:${port}/${database}`);
});

client.on('error', () => {
    console.log('error in connection');
});

client.on('disconnected', () => {
    console.log('connection disconnected');
    client = MongoClient.createConnection(`mongodb://${host}:${port}/${database}`, { autoReconnect: true })
});
client.on('reconnected', () => {
    console.log("reconnected");
});

export default client;