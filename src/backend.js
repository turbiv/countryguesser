
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

app.get('/api/scores/', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      }else{
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({error: 'malformatted id'})})
});

app.post('/api/scores', (request, response) =>{
  const bodycontent = request.body;

  if (!bodycontent.name || !bodycontent.score) {
    return response.status(400).json({ error: "Name or number is missing" });
  }

  const newScore = new Score({
    name: bodycontent.name,
    correct: bodycontent.correct,
    wrong: bodycontent.wrong
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