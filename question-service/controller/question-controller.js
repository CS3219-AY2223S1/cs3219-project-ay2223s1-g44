import {
    ormGetRandomQuestion as _getRandomQuestion,
    ormGetSpecifiQuestion as _getSpecifiQuestion,
} from '../model/question-orm.js';

export async function getRandomQuestion(req, res) {
    try {
        const { difficulty } = req.params;

        const questionPromise = _getRandomQuestion(difficulty);

        questionPromise.then((questionObj) => {
            if (!questionObj) {
            return res.status(404).json({ err: "No question found!" })
            }
        
            res.status(200).json({ message: "Question retrieved!", data: questionObj });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}

export async function getSpecificQuestion(req, res) {
    try {
        const { difficulty, id } = req.params;

        const questionPromise = _getSpecifiQuestion(difficulty, id);

        questionPromise.then((questionObj) => {
            if (!questionObj) {
            return res.status(404).json({ err: "No question found!" })
            }
        
            res.status(200).json({ message: "Question retrieved!", data: questionObj });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!' });
    }
}
