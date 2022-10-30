import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    questionId: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }
})

const MatchHistorySchema = new Schema({
    matchId: {
        type: String,
        required: true,
        unique: true,
    },
    playerOneUsername: {
        type: String,
        required: true,
    },
    playerTwoUsername: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    question: {
        type: QuestionSchema,
        required: true,
    }
});

export default mongoose.model('MatchHistory', MatchHistorySchema);
