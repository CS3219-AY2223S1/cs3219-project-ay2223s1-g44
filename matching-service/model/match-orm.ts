import { Difficulty } from '../types';
import { createMatchHistory, findMatchHistory } from './repository';

export async function ormCreateMatchHistory(
    matchId: string,
    playerOneUsername: string,
    playerTwoUsername: string,
    question: {
        questionId: number,
        title: string,
        difficulty: Difficulty
    }
) {
    try {
        const newMatch = await createMatchHistory({ matchId, playerOneUsername, playerTwoUsername, question });
        newMatch.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetMatchHistory(username: string) {
    try {
        const matchHistory = await findMatchHistory({ username });
        return matchHistory;
    } catch (err) {
        console.log('Error: Could not find match history');
        return { err };
    }
}