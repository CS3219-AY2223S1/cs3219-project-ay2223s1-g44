import e from 'express';
import MatchModel from './match-model.js';

export async function ormCreateMatch(username, difficulty, socketId) {
    try {
        const match = await MatchModel.findOne({where: {status: "PENDING", difficulty: difficulty}});
        if (match == null) {
            const newMatch = await MatchModel.create({
                status: "PENDING",
                difficulty: difficulty,
                userOne: username,
                userOneSocketId: socketId
            });
            return newMatch;
        } else {
            MatchModel.update({
                userTwo: username,
                status: "IN-PROGRESS",
                userTwoSocketId: socketId}, {where: {
                id: match.id
            }})
            const updatedMatch = await MatchModel.findOne({where: {id: match.id}});
            return updatedMatch;
        }
    } catch (err) {
        console.log('ERROR: Could not create new match');
        return { err };
    }
}

export async function ormGetMatches() {
    try {
        const matches = await MatchModel.findAll();
        return matches;
    }catch (err) {
        console.log('ERROR: Could not get match');
        return { err };
    }
}

export async function ormMatchingTimeOut(username, socketId) {
    try {
        const match = await MatchModel.findOne({where: {
            status: "PENDING",
            userOne: username,
            difficulty: difficulty,
            userOneSocketId: socketId}});

        if (match === null) {
            return null;
        }

        MatchModel.update({
            status: "TIMEOUT"}, {where: {
            id: match.id
        }})
        const updatedMatch = await MatchModel.findOne({where: {id: match.id}});
        return updatedMatch;

    } catch (err) {
        console.log('ERROR: Could not change match status');
        return { err };
    }
}