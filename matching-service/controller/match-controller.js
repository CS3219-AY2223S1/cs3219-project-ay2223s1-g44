import {
    ormGetMatch,
    ormEndMatch,
} from '../model/match-orm.js';

export async function getMatch(req, res) {
    try {
        const { username } = req.params;
        if (username) {
            const match = await ormGetMatch(username);
            if (match) {
                if (match.err) {
                    return res.status(500).json({ message: 'Internal server error!' });
                }
                return res.status(200).json(match);
            } else {
                return res.status(400).json({ message: 'Could not find an existing match!' });
            }
        } else {
            return res.status(400).json({ message: 'Username is missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

export async function endMatch(req, res) {
    try {
        const { username } = req.params;
        if (username) {
            const match = await ormEndMatch(username);
            console.log(match);
            if (match) {
                if (match.err) {
                    return res.status(500).json({ message: 'Internal server error!' });
                }
                return res.status(200).json(match);
            } else {
                return res.status(400).json({ message: 'Could not find an existing match!' });
            }
        } else {
            return res.status(400).json({ message: 'Username is missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

