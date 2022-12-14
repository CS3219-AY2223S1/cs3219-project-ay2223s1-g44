import { createUser, deleteUser, findUser } from './repository.js';

// need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({ username, password });
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormGetUser(username) {
    try {
        const user = await findUser({ username });
        return user;
    } catch (err) {
        console.log('ERROR: Could not find existing user');
        return { err };
    }
}

export async function ormDeleteUser(userId) {
    try {
        await deleteUser({ userId });
        return true;
    } catch (err) {
        console.log('ERROR: Could not find existing user');
        return { err };
    }
}

export async function ormChangeUserPassword(username, password) {
    try {
        const user = await findUser({ username });
        user.password = password;
        user.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not find existing user');
        return { err };
    }
}
