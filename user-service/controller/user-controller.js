import bcrypt from 'bcrypt';
import { ormCreateUser as _createUser, ormGetUser as _getUser } from '../model/user-orm.js';
import jwtGenerator from '../utils/jwt-generator.js';
import redisClient from '../utils/redis-client.js';

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            // check if there is an existing user with the same username
            const user = await _getUser(username);
            console.log(user);
            if (user) {
                if (user.err) {
                    return res.status(400).json({ message: 'Could not find an existing user!' });
                }

                console.log(`Username '${username}' already exists!`);
                return res.status(409).json({ message: `Username '${username}' already exists!` });
            }

            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({ message: 'Could not create a new user!' });
            } else {
                console.log(`Created new user ${username} successfully!`);
                return res
                    .status(201)
                    .json({ message: `Created new user ${username} successfully!` });
            }
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

export async function getJwt(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            // check if there is an existing user with the same username
            const user = await _getUser(username);
            console.log(user);

            // user does not exist
            if (!user) {
                console.log('Username or password is incorrect!');
                return res.status(401).json({ message: 'Username or password is incorrect!' });
            }

            // error encountered during request
            if (user.err) {
                return res.status(400).json({ message: 'Could not find an existing user!' });
            }

            // incorrect password
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ message: 'Username or password is incorrect!' });
            }

            const stringifiedUserId = user._id.toString();
            const token = jwtGenerator(stringifiedUserId);

            console.log('Logged in successfully!');
            return res
                .cookie('token', token, { httpOnly: true })
                .status(200)
                .json({ message: 'Logged in successfully!', token });
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

export async function clearJwt(req, res) {
    try {
        const { token, tokenExp } = req;

        const tokenKey = `bl_${token}`;
        await redisClient.set(tokenKey, token);
        redisClient.expireAt(tokenKey, tokenExp);

        return res.clearCookie('token').status(200).json({ message: 'Successfully logged out!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error!' });
    }
}
