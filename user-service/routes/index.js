import express from "express";

import { createUser, getJwt } from "../controller/user-controller.js";
import wrap from "../utils/wrap.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from user-service"));

// Create new user
router.post("/register", wrap(createUser));

// Login existing user
router.post("/login", wrap(getJwt));

export default router;
