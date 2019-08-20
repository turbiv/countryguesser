import React, { useState, useEffect } from 'react'
import ReactDOM from "react-dom";
import Countries from './services/countryService'

const GetAnswer = ({submit, change, val}) =>{
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

const GuessNotification = ({text, correct}) =>{
  if(text === null){
    return null
  }

  const color = correct ? "green" : "red";

  const notificationStyle = {
    color: color
  };

  return(
    <div style={notificationStyle}>
      <p>{text}</p>
    </div>
  );

};

const Question = () =>{
  const [countries, setCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [guessValue, setGuessValue] = useState('');
  const [displayRandomCountry, setDisplayRandomCountry] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [notificationText , setNotificationText] = useState("");
  const [isCorrect, setIsCorrect] = useState("");

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
    console.log("-----");

    if(!guessedCountries.includes(displayRandomCountry.name)){

      if(guessValue.toLowerCase() === displayRandomCountry.name.toLowerCase()){
        getnewcountry();
        console.log("Guess was correct!")
      }else{
        getnewcountry();
        setNotificationText(`The correct answer was: ${answer}`);
        setIsCorrect(false);
        setTimeout(() =>{
          setNotificationText(null);
        }, 5000);
        console.log("Guess was incorrect :(")
      }

      setGuessedCountries(() => guessedCountries.concat(displayRandomCountry.name));
    }else{
      getnewcountry();
    }
    setGuessValue("")
  };

  const getnewcountry = () =>{
    const randomcountryindex = Math.floor(Math.random() * countries.length);
    const country = countries[randomcountryindex];
    if(!guessedCountries.includes(country.name)){
      setDisplayRandomCountry(country);
      handleQandA(country)
    }else{
      getnewcountry()
    }
  };

  return(
    <div>
      <GuessNotification text={notificationText} correct={isCorrect}/>
      <RenderQuestion question={question} guessValue={guessValue} guesshandle={handleGuessSubmit} change={handleUsernameChange} country={displayRandomCountry.name} guessedlistlength={guessedCountries.length}/>
    </div>
  );
};

const RenderQuestion = (props) =>{
  if(props.guessedlistlength === 20){
    return(
      <div>
        <p>Game over</p>
      </div>
    )
  }else{
    return(
      <div>
        <p>Question:{props.guessedlistlength}/20</p>
        <p>What is the {props.question} of {props.country}</p>
        <GetAnswer submit={props.guesshandle} change={props.change} val={props.guessValue}/>
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