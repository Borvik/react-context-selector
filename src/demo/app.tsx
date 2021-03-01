import React, { useState } from 'react';
import { TestComponent } from '../library';
import './style.scss';

export function App() {
  const [c, setC] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.svg" style={{maxHeight: '40vmin'}} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/demo/app.tsx</code> and save to reload.
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
        <TestComponent>
          <div>Some Child</div>
        </TestComponent>
      </header>
    </div>
  )
}