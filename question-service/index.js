import express from 'express';
import { getSpecificQuestion, getRandomQuestion } from './controller/question-controller.js';

const app = express();

// routes
app.get('/', async (req, res) => {
  res.json({ message: "We are at home!" });
});

app.get('/questions/:difficulty', getRandomQuestion);

app.get('/questions/:difficulty/:id', getSpecificQuestion);

app.listen(5001, () => {
  console.log("Question service listening on port 5001")
});