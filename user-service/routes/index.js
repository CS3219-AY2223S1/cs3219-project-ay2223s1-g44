import express from 'express';
import authorisationBouncer from '../bouncers/authorisationBouncer.js';
import { createUser, getJwt, deleteUser, clearJwt, } from "../controller/user-controller.js";
import wrap from "../utils/wrap.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'));

// Create new user
router.post('/register', wrap(createUser));

// Login existing user
router.post('/login', wrap(getJwt));

// Logout current user
router.delete('/logout', [authorisationBouncer], wrap(clearJwt));

// Login existing user
router.delete("/delete_account", wrap(deleteUser));

export default router;
