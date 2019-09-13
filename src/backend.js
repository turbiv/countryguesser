
require("dotenv").config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const Score = require('./models/mongo');

app.use(cors());

morgan.token('persondetails', () => false);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :persondetails'));
app.use(bodyParser.json());

app.get('/api/scores', (request, response) => {
  Score.find({}).then(scores =>{
    response.json(scores.map(score => score.toJSON()))
  })
    .catch(error => console.log(error))
});

app.post('/api/scores', (request, response) =>{
  const bodycontent = request.body;
  console.log(bodycontent)

  const newScore = new Score({
    name: bodycontent.name,
    results:{
      correct: bodycontent.results.correct,
      wrong: bodycontent.results.wrong
    }
  });

  newScore
    .save()
    .then(saved => response.json(saved.toJSON()));

});

const errorHandler = (error, request, response, next) =>{
  if(error.name === 'CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({error: "malformatted id"})
  } else if(error.name === 'ValidationError' && (error.errors.number.properties.type === 'unique' || error.kind === 'unique')){
    return response.status(400).send({error: error.message})
  }

  next(error)
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});