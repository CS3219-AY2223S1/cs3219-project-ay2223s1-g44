import 'dotenv/config';
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function getSpecificQuestion(params) {
    let { difficulty, id } = params;

    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const question = await db.collection('questionmodels').aggregate([
        { $match: { difficulty: difficulty } },
    ]).toArray();

    return question[id];
}

export async function getRandomQuestion(params) {
    let { difficulty } = params;

    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const question = await db.collection('questionmodels').aggregate([
        { $match: { difficulty: difficulty } },
        { $sample: { size: 1 } }
    ]).toArray();

    return question[0];
}