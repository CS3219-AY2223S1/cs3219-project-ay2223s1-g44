import Match from './match-model.js';

export async function ormCreateMatch(username, difficulty) {
    try {
        const match = await Match.findOne({where: {difficulty: difficulty, userTwo: null}});
        if (match == null) {
            const newMatch = await Match.create({difficulty: difficulty, userOne: username});
            return newMatch;
        }else {
            Match.update({userTwo: username}, {where: {
                id: match.id
            }})
            const updatedMatch = await Match.findOne({where: {id: match.id}});
            return updatedMatch;
        }
    } catch (err) {
        console.log('ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetMatches() {
    try {
        const matches = await Match.findAll();
        return matches;
    }catch (err) {
        console.log('ERROR: Could not get match');
        return { err };
    }
}