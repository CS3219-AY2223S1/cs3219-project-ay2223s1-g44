import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let MatchModelSchema = new Schema({
    matchId: {
        type: String,
        required: true,
        unique: true,
    },
    username1: {
        type: String,
        required: true,
    },
    username2: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    questionId: {
        type: String,
        required: true,
    },
    questionTitle: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    }
});

export default mongoose.model('MatchModel', MatchModelSchema);
