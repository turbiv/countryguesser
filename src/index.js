import React, { useState, useEffect } from 'react'
import ReactDOM from "react-dom";
import Countries from './services/countryService'

const GetUsername = ({submit, change, val}) =>{
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
  const [displayDandomCountry, setDisplayRandomCountry] = useState("");

  const handleUsernameChange = (event) =>{
    setGuessValue(event.target.value)
  };

  const getRandomCountry = () =>{
    const randomcountryindex = Math.floor(Math.random() * countries.length);
    return countries[randomcountryindex];
  };

  useEffect(() =>{
    Countries
      .getCountries()
      .then(response => setCountries(response));
  },[]);

  const handleGuessSubmit = (event) =>{
    event.preventDefault();
    const country = getRandomCountry();

    if(!guessedCountries.includes(country.name)){

      if(guessValue.toLowerCase() === country.name.toLowerCase()){
        console.log("Guess was correct!")
      }else{
        console.log("Guess was incorrect :(")
      }

      setGuessedCountries(() => guessedCountries.concat(country.name));
      console.log(guessedCountries);
    }else{
      handleGuessSubmit(event)
    }
    setGuessValue("")
  };

  const countryname = () =>{
    const country = getRandomCountry();
    if(!guessedCountries.includes(country.name)){
      setDisplayRandomCountry(country.name)
    }else{
      countryname()
    }
  };

  

  return(
    <div>
      <p>Current question</p>
      <GetUsername submit={handleGuessSubmit} change={handleUsernameChange} val={guessValue}/>
    </div>
  );
};

const App = () => {



  return (
    <div>
      <Question/>
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));