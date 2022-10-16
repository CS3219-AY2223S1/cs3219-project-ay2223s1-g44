import express from 'express';
import {
    getMatch,
    endMatch
} from '../controller/match-controller.js';

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from match-service'));

// Get active match for the user
router.get('/match', getMatch);

// End active match for the user
router.put('/end', endMatch);

export default router;
