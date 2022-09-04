import { ormCreateMatch as _createMatch,
         ormGetMatches as _getMatches,
         ormMatchingTimeOut as _timeOutMatch,
 } from '../model/match-orm.js';

export async function createMatch(username, difficulty, socketId) {
    try {
        if (username && difficulty) {
            const resp = await _createMatch(username, difficulty, socketId);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new match!'});
            } else {
                console.log(`Created new ${difficulty} match successfully!`)
                return res.status(201).json(resp);
            }
        } else {
            return res.status(400).json({message: 'Username, Difficulty and/or SocketId are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new match!'})
    }
}

export async function getMatches() {
    try {
        const resp = await _getMatches();
        console.log(resp);
        if (resp.err) {
            return res.status(400).json({message: 'Could not get match!'});
        } else {
            console.log("ok");
            return res.status(201).json(resp);
        }

    } catch (err) {
        return res.status(500).json({message: 'Database failure when getting match!'})
    }
}

export async function timeOutMatch(username, socketId) {
    try {
        const resp = await _timeOutMatch();
        console.log(resp);
        if (resp.err) {
            return res.status(400).json({message: 'Could not modify match status!'});
        } else {
            console.log("ok");
            return res.status(201).json(resp);
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when removing match!'})
    }
}