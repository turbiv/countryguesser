import React, { useState, useEffect } from 'react'
import ReactDOM from "react-dom";
import Countries from './services/countryService'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';

const SetSubmit = ({submit, change, val}) =>{
  return(
    <form onSubmit={submit}>
      <div>
        <input onChange={change} value={val}/>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
};

const Question = () =>{
  const [countries, setCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [guessValue, setGuessValue] = useState('');
  const [displayRandomCountry, setDisplayRandomCountry] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [progress, setProgress] = useState({"correct":0, "wrong":0});

  const handleUsernameChange = (event) =>{
    setGuessValue(event.target.value)
  };

  const handleQandA = (country) =>{
    const country_data = [[country.population, "population"], [country.capital, "capital"]];
    //country.currencies.forEach(cur => country_data.push(cur.name))
    const randitem = country_data[Math.floor(Math.random()*country_data.length)];
    setQuestion(randitem[1]);
    setAnswer(randitem[0])
  };

  useEffect(() =>{
    Countries

      .getCountries()
      .then(response => {
        const randomcountryindex = Math.floor(Math.random() * response.length);
        handleQandA(response[randomcountryindex]);
        console.log("Get random country");
        console.log(response[randomcountryindex]);
        setCountries(response);
        return setDisplayRandomCountry(response[randomcountryindex])
      });
  },[]);

  const handleGuessSubmit = (event) =>{
    event.preventDefault();
    console.log("asd");
    console.log("Handle Guess submit");
    console.log(displayRandomCountry);
    console.log(question);
    console.log(answer);
    console.log(progress);
    console.log("-----");

    if(!guessedCountries.includes(displayRandomCountry.name)){

      if(guessValue.toLowerCase() === displayRandomCountry.name.toLowerCase()){
        const newProgess = {
          ...progress,
          correct: progress.correct +1
        };
        setProgress(newProgess);
        console.log("Guess was correct!")
      }else{
        const newProgess = {
          ...progress,
          wrong: progress.wrong +1
        };
        setProgress(newProgess);
        store.addNotification({
          title: "Wrong answer",
          message: `The correct answer was: ${answer}`,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          width: 300,
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
        console.log("Guess was incorrect :(")
      }
      getnewcountry();

      setGuessedCountries(guessedCountries.concat(displayRandomCountry.name));
    }else{
      getnewcountry();
    }
    setGuessValue("")
  };

  const getnewcountry = () =>{
    const randomcountryindex = Math.floor(Math.random() * countries.length);
    const country = countries[randomcountryindex];
    console.log(guessedCountries);
    if(!guessedCountries.includes(country.name)){
      setDisplayRandomCountry(country);
      handleQandA(country)
    }else{
      getnewcountry()
    }
  };

  return(
    <div>
      <ReactNotification/>
      <RenderQuestion progress={progress} question={question} guessValue={guessValue} guesshandle={handleGuessSubmit} change={handleUsernameChange} country={displayRandomCountry.name} guessedlistlength={guessedCountries.length}/>
    </div>
  );
};

const RenderQuestion = (props) =>{
  const [name, setName] = useState("");
  const [currentScores, setCurrentScores] = useState([]);

  useEffect(()=>{
    Countries
      .getScores()
      .then(response => setCurrentScores(response));
  },[]);

  const handleNameChange = event =>{
    setName(event.target.value)
  };

  const handleScoreSubmit = event =>{
    event.preventDefault();
    const addscore = {
      name: name,
      results: props.progress
    };
    Countries
      .addScore(addscore)
      .then(response => setCurrentScores(currentScores.concat(response)))
  };

  if(props.guessedlistlength === 20){
    return(
      <div>
        <div>
        <p>Game over</p>
        <p>Results</p>
        <p>Correct: {props.progress.correct} Wrong: {props.progress.wrong}</p>
        </div>
        <div>
          <SetSubmit submit={handleScoreSubmit} change={handleNameChange} val={name}/>
          {currentScores.map((score, i) => <p key={i}>Name: {score.name} Correct: {score.results.correct} Wrong: {score.results.wrong}</p>)}
        </div>
      </div>
    )
  }else{
    return(
      <div>
        <p>Question:{props.guessedlistlength}/20</p>
        <p>What is the {props.question} of {props.country}</p>
        <SetSubmit submit={props.guesshandle} change={props.change} val={props.guessValue}/>
      </div>
    )
  }

};

const App = () => {
  return (
    <div>
      <Question/>
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));