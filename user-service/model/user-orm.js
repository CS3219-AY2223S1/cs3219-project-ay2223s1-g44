import { createUser, doesUserExist, correctUserandPwd } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({username, password});

        //check for existing user
        const exists = await doesUserExist(newUser);
        if (exists.length > 0) {
            return -1;
        }

        newUser.save();
        return true;

    } catch (err) {
        return { err };
    }
}

export async function ormGetUser(username, password) {
    try {
        const currentUser = await createUser({username, password});
        const exists = await correctUserandPwd(currentUser);

        //check for existing user
        if (exists.length <= 0) {
            return -1;
        }

        return true;   
    } catch (err) {
        return { err };
    }
}

