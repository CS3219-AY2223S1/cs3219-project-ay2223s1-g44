
import 'dotenv/config';
import MatchModel from './match-model.js';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function findMatch(params) {
    return MatchModel.findOne(params);
}

export async function createMatch(params) {
    const newMatch = new MatchModel(params);
    newMatch.save();

    return newMatch;
}

export async function getMatches() {
    const matches = await MatchModel.findAll();

    return matches;
}