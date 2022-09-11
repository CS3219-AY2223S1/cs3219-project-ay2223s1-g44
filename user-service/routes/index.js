import express from 'express';
import authorisationBouncer from '../bouncers/authorisationBouncer.js';
import {
    changeUserPassword,
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
router.delete('/delete_account', [authorisationBouncer], wrap(deleteUser));

// Change current user password
router.put('/password', [authorisationBouncer], wrap(changeUserPassword));

// Verify current user
router.get('/verify', [authorisationBouncer], wrap(verifyJwt));

export default router;
