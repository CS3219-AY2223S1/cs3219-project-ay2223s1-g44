import { createMatch, endMatch, findHistory, findMatch } from './repository.js';

export async function ormCreateMatch(matchId, username1, username2, difficulty, questionId, questionTitle) {
    try {
        const newMatch = await createMatch({ matchId, username1, username2, difficulty, questionId, questionTitle });
        newMatch.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetMatch(username) {
    try {
        const match = await findMatch({ username });
        return match;
    } catch (err) {
        console.log('ERROR: Could not find match');
        return { err };
    }
}

export async function ormEndMatch(username) {
    try {
        const match = await endMatch({ username });
        return match;
    } catch (err) {
        console.log('ERROR: Could not end match');
        return { err };
    }
}

export async function ormGetHistory(username) {
    try {
        const history = await findHistory({ username });
        return history;
    } catch (err) {
        console.log('ERROR: Could not find match');
        return { err };
    }
}