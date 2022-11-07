import 'dotenv/config';
import mongoose from 'mongoose';
import QuestionModel from './question-model.js';

let mongoDB = process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function getSpecificQuestion(params) {
    let { id } = params;

    const question = QuestionModel.findOne(
        { id: id }
    );

    return question;
}

export async function getRandomQuestion(params) {
    let { difficulty } = params;

    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const question = QuestionModel.aggregate([
        { $match: { difficulty: difficulty } },
        { $sample: { size: 1 } }
    ]);

    return question;
}