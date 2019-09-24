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
  const [isOnline, setIsOnline] = useState(false);

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
        setIsOnline(true);
        return setDisplayRandomCountry(response[randomcountryindex])
      });
  },[]);

  const handleGuessSubmit = (event) =>{
    event.preventDefault();
    if(!guessedCountries.includes(displayRandomCountry.name)){
      if(guessValue === undefined){
        getnewcountry();
      }
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
        <RenderQuestion progress={progress} question={question} guessValue={guessValue} guesshandle={handleGuessSubmit}
                        change={handleUsernameChange} country={displayRandomCountry.name}
                        guessedlistlength={guessedCountries.length}/>
      </div>
    );
  }else{
    return(<div>
      <p>Loading...</p>
    </div>);
  }
};

const RenderQuestion = (props) =>{
  const [name, setName] = useState("");
  const [currentScores, setCurrentScores] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);

  useEffect(()=>{
    Countries
      .getScores()
      .then(response => setCurrentScores(response))
      .then(()=> setIsOnline(true));
  },[]);

  const handleNameChange = event =>{
    setName(event.target.value)
  };

  const handleScoreSubmit = event =>{
    console.log("Handle score submit");
    handleAllResults();
    event.preventDefault();
    const addscore = {
      name: name,
      results: props.progress
    };
    Countries
      .addScore(addscore)
      .then(response => setCurrentScores(currentScores.concat(response)))
      .then(response => setSubmitted(true))
  };

  const handlePlayerSubmit = () =>{
    if(submitted){
      return <p>Cannot submit a result more than once</p>
    }else{
      return <SetSubmit submit={handleScoreSubmit} change={handleNameChange} val={name}/>
    }
  };

  const handleAllResults = () =>{
    let pageScores = [];
    let allPageScores = [];
    currentScores.map((score, i) => {
      if ((i % 5) === 0 && i !== 0){
        allPageScores.push(pageScores);
        pageScores = []
      }
      pageScores.push(<p key={i}>Name: {score.name} Correct: {score.results.correct} Wrong: {score.results.wrong}</p>);
    });
    allPageScores.push(pageScores);
    return allPageScores
  };

  const handlePages = (selected) =>{
    const allResults = handleAllResults();
    return allResults[selected]
  };

  const Pages = () =>{
    if(handleAllResults().length > 5){
      let minimizedPagesIndex = [];
      let resultsLength = handleAllResults().length;
      let currentSelectedPage = selectedPage;
      let iterator = 0;
        //TODO:
        //Get 4 digits next to the current page ie. 6 7 ->8<- 9 10
        //Display current page in bolded digit
        //Last page number and first page number
        //In future , have "..." between last and first

        if(currentSelectedPage >= 3){
          while(minimizedPagesIndex.length !== 3){
            minimizedPagesIndex.push(currentSelectedPage = currentSelectedPage - 1)
          }
        }

      if(currentSelectedPage <= (resultsLength - 2)){
        while(minimizedPagesIndex.length !== 3){
          minimizedPagesIndex.push(currentSelectedPage = currentSelectedPage - 1)
        }
      }


      //TODO: fix this ugly ass looking messss
      //Get last page number
      minimizedPagesIndex.push(resultsLength - 1);



      console.log(selectedPage);
      console.log(minimizedPagesIndex);
      console.log(handleAllResults().length);
      return(
        <div>
          <button onClick={() => selectedPage !== 0 ? setSelectedPage(selectedPage - 1) : null}>{'<<'}</button>
          {minimizedPagesIndex.map((n, index) => <button key={index} onClick={() => setSelectedPage(minimizedPagesIndex[index])}>{minimizedPagesIndex[index] + 1}</button>)}
          <button onClick={() => handleAllResults().length !== selectedPage + 1 ? setSelectedPage(selectedPage + 1) : null}>{'>>'}</button>
        </div>
      )
    }else {
      return (
        <div>
          <button onClick={() => selectedPage !== 0 ? setSelectedPage(selectedPage - 1) : null}>{'<<'}</button>
          {handleAllResults().map((n, index) => <button key={index} onClick={() => setSelectedPage(index)}>{index + 1}</button>)}
          <button onClick={() => handleAllResults().length !== selectedPage + 1 ? setSelectedPage(selectedPage + 1) : null}>{'>>'}</button>
        </div>
      )
    }
  };

  const PlayerResults = () =>{
    if(isOnline) {
      return (
        <div>
          {handlePages(selectedPage).map((result) => result)}
          <Pages/>
        </div>)
    }else{
      return(<p>Loading...</p>)
    }
  };

  if(props.guessedlistlength === 20){
    return(
      <div>
        <div>
        <p>Game over</p>
        <p>Results</p>
        <p>Correct: {props.progress.correct} Wrong: {props.progress.wrong}</p>
        </div>
        {handlePlayerSubmit()}
        <PlayerResults/>
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


/*
if (minimizedPagesIndex.length <= 2 && (currentSelectedPage <= minimizedPagesState[2])) {
  minimizedPagesIndex.push(currentSelectedPage = currentSelectedPage + 1)
  console.log("first if", currentSelectedPage = currentSelectedPage + 1)
}else{
  minimizedPagesIndex.push(minimizedPagesState[iterator]);
  console.log("second if", iterator)
  iterator = iterator + 1
}*/