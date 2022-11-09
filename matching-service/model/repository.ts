import 'dotenv/config';
import MatchModel from './match-model';

//Set up mongoose connection
import mongoose from 'mongoose';
import { MatchHistory } from '../types';

let mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

// @ts-expect-error TS(2769): No overload matches this call.
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createMatchHistory(params: MatchHistory) {
    return new MatchModel(params);
}

export async function findMatchHistory(params: {
    username: string;
}) {
    const result = MatchModel.find({
        $or: [
            {playerOneUsername: params.username},
            {playerTwoUsername: params.username}
        ]
    })
    return result;
}
