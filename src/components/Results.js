import Countries from "../services/countryService";
import React, { useState, useEffect } from 'react'

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

const RenderResults = ({guessedlistlength, questionstring, guessValue, guesshandle, change, progress}) =>{
  const [name, setName] = useState("");
  const [currentScores, setCurrentScores] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

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
    event.preventDefault();
    const addscore = {
      name: name,
      results: progress
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

  if(guessedlistlength === 20){
    return(
      <div>
        <div>
          <p>Game over</p>
          <p>Results</p>
          <p>Correct: {progress.correct} Wrong: {progress.wrong}</p>
        </div>
        {handlePlayerSubmit()}
        <PlayerScoreBoard onlineStatus={isOnline} currentScores={currentScores}/>
      </div>
    )
  }else{
    return(
      <div>
        <p>Question:{guessedlistlength}/20</p>
        <p>{questionstring}</p>
        <SetSubmit submit={guesshandle} change={change} val={guessValue}/>
      </div>
    )
  }
};

const PlayerScoreBoard = ({onlineStatus, currentScores}) =>{
  if(onlineStatus) {
    return (
      <div>
        <ScoreBoard currentScores={currentScores}/>
      </div>)
  }else{
    return(<p>Loading...</p>)
  }

};

const ScoreBoard = ({currentScores}) =>{
  const [selectedPage, setSelectedPage] = useState(0);
  const handleAllResults = () =>{
    let pageScores = [];
    let allPageScores = [];
    currentScores.map((score, i) => {
      if ((i % 5) === 0 && i !== 0){
        allPageScores.push(pageScores);
        pageScores = []
      }
      return pageScores.push(<p key={i}>Name: {score.name} Correct: {score.results.correct} Wrong: {score.results.wrong}</p>);
    });
    allPageScores.push(pageScores);
    return allPageScores
  };

  const handlePages = (selected) =>{
    const allResults = handleAllResults();
    return allResults[selected]
  };

  //This can be used a separate component on another project

  if (handleAllResults().length > 7) {
    let minimizedPagesIndex = [];
    let resultsLength = handleAllResults().length;
    //TODO:
    //Get 4 digits next to the current page ie. 5 6 7 ->8<- 9 10 11
    //Display current page in bolded digit
    //Last page number and first page number
    //In future , have "..." between last and first

    if (selectedPage < 3) {
      const firstpages = [0, 1, 2, 3, 4, 5];
      firstpages.forEach((item, iterator) => minimizedPagesIndex.push(iterator))
    } else {
      minimizedPagesIndex.push(selectedPage - 2);
      minimizedPagesIndex.push(selectedPage - 1);
      minimizedPagesIndex.push(selectedPage);
      if (selectedPage < resultsLength - 1) {
        minimizedPagesIndex.push(selectedPage + 1)
      }
      if (selectedPage < resultsLength - 2) {
        minimizedPagesIndex.push(selectedPage + 2)
      }
    }

    return (
      <div>
        {handlePages(selectedPage).map((result) => result)}
        <button onClick={() => selectedPage !== 0 ? setSelectedPage(selectedPage - 1) : null}>{'<<'}</button>
        <button onClick={() => setSelectedPage(0)}>{selectedPage >= 3 ? "1" : null}</button>
        <span>{selectedPage >= 3 ? "..." : null}</span>
        {minimizedPagesIndex.map((n, index) => {
          if (minimizedPagesIndex[index] === selectedPage) {
            return <button key={index}
                           onClick={() => setSelectedPage(minimizedPagesIndex[index])}>{minimizedPagesIndex[index] + 1} bold</button>
          }
          return <button key={index}
                         onClick={() => setSelectedPage(minimizedPagesIndex[index])}>{minimizedPagesIndex[index] + 1}</button>
        })}
        <span>{selectedPage <= resultsLength - 4 ? "..." : null}</span>
        <button
          onClick={() => setSelectedPage(resultsLength - 1)}>{selectedPage <= resultsLength - 4 ? resultsLength : null}</button>
        <button
          onClick={() => handleAllResults().length !== selectedPage + 1 ? setSelectedPage(selectedPage + 1) : null}>{'>>'}</button>
      </div>
    )
  } else {
    return (
      <div>
        {handlePages(selectedPage).map((result) => result)}
        <button onClick={() => selectedPage !== 0 ? setSelectedPage(selectedPage - 1) : null}>{'<<'}</button>
        {handleAllResults().map((n, index) => <button key={index}
                                              onClick={() => setSelectedPage(index)}>{index + 1}</button>)}
        <button
          onClick={() => handleAllResults().length !== selectedPage + 1 ? setSelectedPage(selectedPage + 1) : null}>{'>>'}</button>
      </div>
    )
  }
};


export default RenderResults