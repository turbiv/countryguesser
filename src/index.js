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
  const [displayRandomCountry, setDisplayRandomCountry] = useState("asd");

  const handleUsernameChange = (event) =>{
    setGuessValue(event.target.value)
  };

  useEffect(() =>{
    Countries
      .getCountries()
      .then(response => {
        const randomcountryindex = Math.floor(Math.random() * response.length);
        console.log("Get random country")
        console.log(response[randomcountryindex])
        setCountries(response)
        return setDisplayRandomCountry(response[randomcountryindex])
      });
  },[]);

  const handleGuessSubmit = (event) =>{
    event.preventDefault();
    console.log("asd");
    console.log(displayRandomCountry);

    if(!guessedCountries.includes(displayRandomCountry.name)){

      if(guessValue.toLowerCase() === displayRandomCountry.name.toLowerCase()){
        getnewcountry();
        console.log("Guess was correct!")
      }else{
        getnewcountry();
        console.log("Guess was incorrect :(")
      }

      setGuessedCountries(() => guessedCountries.concat(displayRandomCountry.name));
    }
    setGuessValue("")
  };

  const getnewcountry = () =>{
    const randomcountryindex = Math.floor(Math.random() * countries.length);
    const country = countries[randomcountryindex];
    console.log(guessedCountries)
    if(!guessedCountries.includes(country.name)){
      setDisplayRandomCountry(country)
    }else{
      getnewcountry()
    }
  };



  return(
    <div>
      <p>Current question:</p>
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