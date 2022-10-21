import axios from "axios";

const QUESTION_URL = 'http://localhost:5000/questions';

export async function getRandomQuestion(difficulty) {
    try {
        const question = (await axios.get(QUESTION_URL + `/${difficulty}`)).data;
        return question;
    } catch (err) {
        return err;
    }
}

export async function getQuestion(difficulty, id) {
    try {
        const question = (await axios.get(QUESTION_URL + `/${difficulty}/${id}`)).data;
        return question;
    }
    catch (err) {
        return err;
    }
}