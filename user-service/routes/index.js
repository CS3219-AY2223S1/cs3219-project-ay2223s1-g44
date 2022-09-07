import express from 'express';
import authorisationBouncer from '../bouncers/authorisationBouncer.js';

import { clearJwt, createUser, getJwt } from '../controller/user-controller.js';
import wrap from '../utils/wrap.js';

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'));

// Create new user
router.post('/register', wrap(createUser));

// Login existing user
router.post('/login', wrap(getJwt));

// Logout current user
router.delete('/logout', [authorisationBouncer], wrap(clearJwt));

export default router;
