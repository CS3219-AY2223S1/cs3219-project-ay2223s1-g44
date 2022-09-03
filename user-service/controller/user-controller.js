import { ormCreateUser as _createUser, ormGetUser as _getUser } from '../model/user-orm.js'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);

            if (resp == -1) {
                return res.status(409).json({message: 'Username already taken!'});
            }
            
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }

        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'});
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _getUser(username, password);
            console.log(resp);

            if (resp == -1) {
                return res.status(409).json({message: 'Wrong username or password!'});
            }

            if (resp.err) {
                return res.status(400).json({message: 'User or password incorrect!'});
            } else {
                console.log(`login to ${username} successfully!`)
                return res.status(201).json({message: `Login to ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when logging in!'});
    }
}
