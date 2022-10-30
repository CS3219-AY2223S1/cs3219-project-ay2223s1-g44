import { createMatch, endMatch, findMatch } from './repository.js';

export async function ormCreateMatch(matchId: any, username1: any, username2: any, difficulty: any, questionId: any) {
    try {
        const newMatch = await createMatch({ matchId, username1, username2, difficulty, questionId });
        newMatch.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetMatch(username: any) {
    try {
        const match = await findMatch({ username });
        return match;
    } catch (err) {
        console.log('ERROR: Could not find match');
        return { err };
    }
}

export async function ormEndMatch(username: any) {
    try {
        const match = await endMatch({ username });
        return match;
    } catch (err) {
        console.log('ERROR: Could not end match');
        return { err };
    }
}