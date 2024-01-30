import React, { useEffect } from 'react';
import { createContext } from '../library';
import { useRenderCount } from './useRenderCount';

const { Provider, useState: useClickState } = createContext({
  clicks: 0,
  time: 0,
})

const TestContextProvider: React.FC = ({ children }) => {
  return <Provider>{children}</Provider>
}

const Clicker: React.FC = () => {
  console.log('Render CLICKER');
  const renderCount = useRenderCount();
  const [clicks, setClickState] = useClickState(cb => cb.clicks);

  return (
    <div>
      <span>Clicks: {clicks} / Render: {renderCount}</span>
      <button onClick={() => setClickState(p => ({ clicks: p.clicks + 1 }))}>Click Me</button>
    </div>
  );
}

const Timer: React.FC = () => {
  console.log('Render TIMER');
  const renderCount = useRenderCount();
  const [time, setClickState] = useClickState(cb => cb.time);
  useEffect(() => {
    const interval = setInterval(() => setClickState(v => ({ time: v.time + 1 })), 1000);
    return () => clearInterval(interval);
  }, [setClickState]);
  return <div><span>Time: {time}</span><span>Render: {renderCount}</span></div>;
}

export const TestApp: React.FC = () => {
  return (
    <TestContextProvider>
      <Clicker />
      <Timer />
    </TestContextProvider>
  )
}