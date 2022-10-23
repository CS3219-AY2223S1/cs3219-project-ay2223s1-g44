const express = require('express');
const questions = require('./questions.json');

const app = express();

const processedQuestions = {
  easy: [],
  medium: [],
  hard: [],
};

questions.forEach((x) => {
  processedQuestions[x.difficulty.toLowerCase()].push(x);
});

// routes
app.get('/', (req, res) => {
  res.json({ message: "We are at home!" });
});

app.get('/questions/:difficulty', (req, res) => {
  const { difficulty } = req.params;
  let questionObj;
  const questionArr = processedQuestions[difficulty];

  questionObj = questionArr?.[Math.floor(Math.random() * questionArr.length)];
  
  if (!questionObj) {
    return res.status(404).json({ err: "No question found!" })
  }

  res.status(200).json({ message: "Question retrieved!", data: questionObj });
});

app.listen(5000, () => {
    console.log("Question service listening on port 5000")
});

module.exports = app;