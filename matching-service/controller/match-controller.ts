import {
    ormGetMatch,
    ormEndMatch,
} from '../model/match-orm.js';
import { getQuestion } from '../utils/getQuestion.js';

export async function getMatch(req: any, res: any) {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ message: 'Username is missing!' });
        }

        const match = await ormGetMatch(username);

        if (!match) {
            return res.status(404).json({ message: 'Could not find an existing match!' });
        }

        if ((match as any).err) {
            return res.status(500).json({ message: 'Internal server error!' });
        }

        const question = await getQuestion((match as any).difficulty, (match as any).questionId);
        return res.status(200).json({ match, question });


    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

export async function endMatch(req: any, res: any) {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ message: 'Username is missing!' });
        }

        const match = await ormEndMatch(username);

        if (!match) {
            return res.status(404).json({ message: 'Could not find an existing match!' });
        }

        if ((match as any).err) {
            return res.status(500).json({ message: 'Internal server error!' });
        }
        return res.status(200).json(match);

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

