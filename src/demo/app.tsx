import React, { useState } from 'react';
import { TestApp as NormalTestApp } from './normal-context';
import { TestApp as SelectorTestApp } from './selector-context';
import { TestApp as SelConsumerTestApp } from './sel-consumer-context';
import { TestApp as SelHOCTestApp } from './sel-hoc-context';
import './style.scss';

const ModeOptions = {
  none: 'No Example',
  context: 'Normal React Context',
  selector_context: 'Selector Context',
  sel_consumer: 'Selector Consumer',
  sel_hoc: 'Selector Higher-Order-Component',
} as const;
type ModeOptionsEnum = keyof typeof ModeOptions;

const ModeKeys = Object.keys(ModeOptions) as (keyof typeof ModeOptions)[];

export function App(): JSX.Element {
  const [mode, setMode] = useState<ModeOptionsEnum>('none');

  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.svg" style={{maxHeight: '40vmin'}} className="App-logo" alt="logo" />
        <div>
          <select onChange={(e) => setMode(e.target.value as ModeOptionsEnum)} value={mode}>
            {ModeKeys.map(k => (<option key={k} value={k}>{ModeOptions[k]}</option>))}
          </select>
        </div>
        {mode === 'context' && <NormalTestApp />}
        {mode === 'selector_context' && <SelectorTestApp />}
        {mode === 'sel_consumer' && <SelConsumerTestApp />}
        {mode === 'sel_hoc' && <SelHOCTestApp />}
      </header>
    </div>
  )
}