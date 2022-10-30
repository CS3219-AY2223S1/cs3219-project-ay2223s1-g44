import axios from "axios";

const QUESTION_URL = 'http://localhost:5001/questions';

export async function getRandomQuestion(difficulty: any) {
    try {
        const question = await axios.get(QUESTION_URL + `/${difficulty}`);
        const { data } = question;
        return data;
    } catch (err) {
        return err;
    }
}

export async function getQuestion(difficulty: any, id: any) {
    try {
        const question = await axios.get(QUESTION_URL + `/${difficulty}/${id}`);
        const { data } = question;
        return data;
    }
    catch (err) {
        return err;
    }
}