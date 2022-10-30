import axios from "axios";
import { Difficulty, Question } from "../types";

const QUESTION_URL = 'http://localhost:5001/questions';

export async function getRandomQuestion(difficulty: Difficulty): Promise<Question | void> {
    const response = await axios.get<{
        message: string,
        data: Question
    }>(QUESTION_URL + `/${difficulty}`)
        .then(response => {
            const { data } = response.data;
            return data;
        })
        .catch(err => {
            throw err;
        })
    return response;
}

export async function getQuestion(difficulty: Difficulty, id: string): Promise<Question | void> {
    const response = await axios.get<Question>(QUESTION_URL + `/${difficulty}/${id}`)
        .then(response => {
            const { data } = response;
            return data;
        })
        .catch(err => {
            throw err;
        })
    return response;
}