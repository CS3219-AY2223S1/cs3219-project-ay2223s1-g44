import axios from "axios";

const QUESTION_URL = 'http://localhost:5000/questions';

export async function getRandomQuestion(difficulty) {
    const question = (await axios.get(QUESTION_URL + `/${difficulty}`)).data;
    return question
}

export async function getQuestion(difficulty, id) {
    const question = (await axios.get(QUESTION_URL + `/${difficulty}/${id}`)).data;
    return question
}