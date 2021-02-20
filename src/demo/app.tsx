import React, { useState } from 'react';
import './style.scss';

export function App() {
  const [c, setC] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.svg" style={{maxHeight: '40vmin'}} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/demo/app.tsx</code> and saved to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => setC(d => d + 1)}>Clicked: {c}</button>
      </header>
    </div>
  )
}