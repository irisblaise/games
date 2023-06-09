import React from 'react';
import './App.css';
import StripBookInputForm from "./Form";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Super Strip Maker</h1>
        <p>Who and what is your story about?</p>
        <StripBookInputForm></StripBookInputForm>
      </header>
    </div>
  );
}

export default App;
