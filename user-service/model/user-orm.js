import { createUser, isUserCreated } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({username, password});

        //check for existing user
        const exists = await isUserCreated(newUser);
        if (exists.length > 0) {
            return -1;
        }

        newUser.save();
        return true;
        
    } catch (err) {
        return { err };
    }
}

