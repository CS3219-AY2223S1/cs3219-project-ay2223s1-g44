import { Request, Response } from 'express';
import { findExistingMatch, leaveMatch } from './redis-controller';
import { createMatchHistory, findMatchHistory } from '../model/repository';

export async function getMatch(req: Request, res: Response) {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ message: 'Username is missing!' });
        }

        const match = await findExistingMatch(username);

        if (!match) {
            return res.status(404).json({ message: 'Could not find an existing match!' });
        }

        return res.status(200).json({ match });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

export async function endMatch(req: Request, res: Response) {
    try {
        const { matchId } = req.params;
        if (!matchId) {
            return res.status(400).json({ message: 'Match ID is missing!' });
        }

        const matchHistory = await leaveMatch(matchId);

        if (!matchHistory) {
            return res.status(404).json({ message: 'Could not find an existing match!' });
        }
        const matchHistoryEntry = await createMatchHistory(matchHistory);
        matchHistoryEntry.save();

        return res.status(200).json(matchHistory);

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

export async function getMatchHistory(req: Request, res: Response) {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ message: 'Username is missing!' });
        }

        const matchHistoryArray = await findMatchHistory({username});

        if (!matchHistoryArray.length) {
            return res.status(404).json({ message: 'Could not find any match history!' });
        }

        return res.status(200).json(matchHistoryArray);

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}