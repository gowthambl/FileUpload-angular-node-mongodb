import MongoClient from 'mongoose';
import Client from './index';


let fileSchema = new MongoClient.Schema({
    fileName: {
        type: String,
        required: true
    },
    originalName: {
        type: String
    },
    date:{
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    }
});

let fileModel = Client.model("files", fileSchema);

export default fileModel;