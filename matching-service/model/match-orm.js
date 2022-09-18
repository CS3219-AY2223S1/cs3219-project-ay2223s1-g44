import MatchModel from './match-model.js';
import { createMatch, findMatch, getMatches } from './repository.js';

export async function ormCreateMatch(username, difficulty, socketId) {
    try {
        const pendingMatch = await findMatch({difficulty: difficulty, status: "PENDING"});
        console.log(pendingMatch);

        if (pendingMatch == null) {
            const match = createMatch({
                status: "PENDING",
                userOne: username,
                userOneSocketId: socketId,
                difficulty: difficulty
            })
            return match;
        } else {
            pendingMatch.userTwo = username;
            pendingMatch.userTwoSocketId = socketId;
            pendingMatch.status = "IN-PROGRESS";
            pendingMatch.save();

            return pendingMatch;
        }
    } catch (err) {
        console.log(err);
        console.log('ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetMatches() {
    try {
        return getMatches();
    }catch (err) {
        console.log('ERROR: Could not get match');
        return { err };
    }
}

export async function ormMatchingTimeOut(username, difficulty, socketId) {
    try {
        const match = await MatchModel.findOne({
            status: "PENDING",
            userOne: username,
            difficulty: difficulty,
            userOneSocketId: socketId});

        if (match === null) {
            return null;
        }

        match.status = "TIMEOUT";
        match.save()

        return match;
    } catch (err) {
        console.log('ERROR: Could not change match status');
        return { err };
    }
}