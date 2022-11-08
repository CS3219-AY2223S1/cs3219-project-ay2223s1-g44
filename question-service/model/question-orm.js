import { getRandomQuestion, getSpecificQuestion } from './repository.js';

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormGetSpecifiQuestion(difficulty, id) {
    try {
        const question = await getSpecificQuestion({ difficulty, id });
        return question;
    } catch (err) {
        console.log('ERROR: Could not find question');
        return { err };
    }
}

export async function ormGetRandomQuestion(difficulty) {
    try {
        const question = await getRandomQuestion({ difficulty });
        return question;
    } catch (err) {
        console.log('ERROR: Could not find question');
        return { err };
    }
}