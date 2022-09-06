import { ormCreateMatch, ormGetMatches } from '../model/match-orm.js';

export async function createMatch(req, res) {
    try {
        const { username, difficulty } = req.body;
        if (username && difficulty) {
            const resp = await ormCreateMatch(username, difficulty);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new match!'});
            } else {
                console.log(`Created new ${difficulty} match successfully!`)
                return res.status(201).json(resp);
            }
        } else {
            return res.status(400).json({message: 'Username and/or Difficulty are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new match!'})
    }
}

export async function getMatches(req, res) {
    try {
        const resp = await ormGetMatches();
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