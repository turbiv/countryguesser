import React from 'react'
import ReactDOM from "react-dom";
import Question from "./components/Question"

const App = () => {
  return (
    <div>
      <Question/>
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));
