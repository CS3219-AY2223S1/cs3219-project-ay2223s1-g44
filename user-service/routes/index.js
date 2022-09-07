import express from 'express';
import authorisationBouncer from '../bouncers/authorisationBouncer.js';
import {
    clearJwt,
    createUser,
    deleteUser,
    getJwt,
    verifyJwt,
} from '../controller/user-controller.js';
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

// Delete existing user
router.delete('/', [authorisationBouncer], wrap(deleteUser));

// Verify current user
router.get('/verify', [authorisationBouncer], wrap(verifyJwt));

export default router;
