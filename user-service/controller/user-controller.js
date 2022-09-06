import { ormCreateUser as _createUser, ormFindUser as _findUser } from "../model/user-orm.js";

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            // check if there is an existing user with the same username
            const user = await _findUser(username);
            console.log(user);
            if (user) {
                if (user.err) {
                    return res.status(400).json({ message: "Could not find an existing user!" });
                }

                console.log(`Username '${username}' already exists!`);
                return res.status(409).json({ message: `Username '${username}' already exists!` });
            }

            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({ message: "Could not create a new user!" });
            } else {
                console.log(`Created new user ${username} successfully!`);
                return res
                    .status(201)
                    .json({ message: `Created new user ${username} successfully!` });
            }
        } else {
            return res.status(400).json({ message: "Username and/or Password are missing!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Database failure when creating new user!" });
    }
}
