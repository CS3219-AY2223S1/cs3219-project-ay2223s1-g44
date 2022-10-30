import 'dotenv/config';
import MatchModel from './match-model.js';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createMatch(params) {
    return new MatchModel(params);
}

export async function findMatch(params) {
    const result = MatchModel.findOne({
        $or: [
            { username1: params.username, isActive: true },
            { username2: params.username, isActive: true }
        ]
    });

    return result;
}

export async function endMatch(params) {
    const result = MatchModel.findOneAndUpdate({
        $or: [
            { username1: params.username, isActive: true },
            { username2: params.username, isActive: true }
        ]
    }
        , { isActive: false });
    return result;
}

export async function findHistory(params) {
    const result = MatchModel.find({
        $or: [
            { username1: params.username},
            { username2: params.username}
        ]
    });

    return result;
}
