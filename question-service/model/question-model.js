import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let QuestionModelSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    title_slug: {
        type: String,
        required: true,
        unique: true,
    },
    link: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    similar_topics: {
        type: [String],
        required: true,
    },
    question: {
        type: String,
        required: true,
    }
});

export default mongoose.model("QuestionModel", QuestionModelSchema);
