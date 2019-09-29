import Countries from "../services/countryService";
import ReactNotification, {store} from "react-notifications-component";
import React, { useState, useEffect } from 'react'
import RenderResults from "../components/Results"

const Question = () =>{
  const [countries, setCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [guessValue, setGuessValue] = useState('');
  const [displayRandomCountry, setDisplayRandomCountry] = useState("");
  const [question, setQuestion] = useState({question: "", answer: "", questiondisplay: ""});
  const [answer, setAnswer] = useState("");
  const [progress, setProgress] = useState({"correct":0, "wrong":0});
  const [isOnline, setIsOnline] = useState(false);

  const handleUsernameChange = (event) =>{
    setGuessValue(event.target.value)
  };
  //TODO: redo question strings (too confusion)
  const handleQandA = (country) =>{
    const country_data = [[country.name, "capital", country.capital], [country.capital, "country capital", country.name]];
    //country.currencies.forEach(cur => country_data.push(cur.name))
    const randitem = country_data[Math.floor(Math.random()*country_data.length)];
    setQuestion({question: randitem[1], answer: randitem[0], questiondisplay: randitem[2]});
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
        setIsOnline(true);
        return setDisplayRandomCountry(response[randomcountryindex])
      });
  },[]);

  const handleGuessSubmit = (event) =>{
    event.preventDefault();
    if(!guessedCountries.includes(question.answer)){
      if(guessValue === undefined){
        getnewcountry();
      }

      if(guessValue.toLowerCase() === question.answer.toLowerCase()){
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
          message: `The correct answer was: ${question.answer}`,
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

      setGuessedCountries(guessedCountries.concat(question.answer));
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

  if(isOnline) {
    return (
      <div>
        <ReactNotification/>
        <RenderResults progress={progress} questionstring={question.question + " " + question.questiondisplay} guessValue={guessValue} guesshandle={handleGuessSubmit}
                       change={handleUsernameChange}
                       guessedlistlength={guessedCountries.length}/>
      </div>
    );
  }else{
    return(<div>
      <p>Loading...</p>
    </div>);
  }
};

export default Question