let questions = require('./questions.json')

//Preprocessing for questions
var countEasy = 0;
var countMedium = 0;
var countHard = 0;

var easyArr= []
var mediumArr = []
var hardArr = []

for (let x in questions) {
    if(questions[x]["difficulty"] == "Easy") {
        countEasy += 1;
        easyArr.push(x);
    }
    if(questions[x]["difficulty"] == "Medium") {
        countMedium += 1;
        mediumArr.push(x);
    }
    if(questions[x]["difficulty"] == "Hard") {
        countHard += 1;
        hardArr.push(x);
    }
}

const express = require('express');

const app = express();

//routes
app.get('/', (req, res) => {
    res.send('We are on home!');
})

app.get('/questions/:difficulty', (req, res) => {
    var difficulty = req.params.difficulty
    var rng = Math.random();
    var questionObj;

    switch (difficulty) {
        case "easy":
            questionObj = questions[String(Math.floor(rng * countEasy))]
            break;
        case "medium":
            questionObj = questions[String(Math.floor(rng * countMedium))]
            break;
        case "hard":
            questionObj = questions[String(Math.floor(rng * countHard))]
            break;
        default:
            questionObj = null;
    }
    // Generate a random number within the index range of the difficulty.
    res.send(questionObj);
})

app.listen(5000, () => {
    console.log("Question service listening on port 5000")
})