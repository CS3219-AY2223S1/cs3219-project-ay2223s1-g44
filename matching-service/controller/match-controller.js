import { ormCreateMatch as _createMatch,
         ormGetMatches as _getMatches,
         ormMatchingTimeOut as _timeOutMatch,
 } from '../model/match-orm.js';

export async function createMatch(username, difficulty, socketId) {
    try {
        if (username && difficulty) {
            const resp = await _createMatch(username, difficulty, socketId);
            // console.log(resp);
            if (resp.err) {
                return {status: 400, message: 'Could not create a new match!'};
            } else {
                //console.log(`Created new ${difficulty} match successfully!`)
                return {status: 201, obj: resp};
            }
        } else {
            return {status: 400, message: 'Username, Difficulty and/or SocketId are missing!'};
        }
    } catch (err) {
        return {status: 500, message: 'Database failure when creating new match!'};
    }
}

export async function getMatches() {
    try {
        const resp = await _getMatches();
        //console.log(resp);
        if (resp.err) {
            return {status: 400, message: 'Could not get match!'};
        } else {
            //console.log("ok");
            return {status: 201, message: 'Matches returned'};
        }

    } catch (err) {
        return {status: 500, message: 'Database failure when getting match!'};
    }
}

export async function timeOutMatch(username, difficulty, socketId) {
    try {
        const resp = await _timeOutMatch(username, difficulty, socketId);
        //console.log(resp);
        if (resp.err) {
            return {status: 400, message: 'Could not modify match status!'};
        } else {
            //console.log("ok");
            return {status: 201, message: json(resp)};
        }
    } catch (err) {
        return {status: 500, message: 'Database failure when removing match!'};
    }
}