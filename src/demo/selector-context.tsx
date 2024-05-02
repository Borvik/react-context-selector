import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { createContext } from '../library';
import { useRenderCount } from './useRenderCount';

const { Provider, useSelector } = createContext({
  clicks: 0,
  time: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  incrementClick: (_: number) => {},
})

const TestContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [clicks, setClicks] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(v => v + 1), 1000);
    return () => clearInterval(interval);
  }, [setTime]);

  const incrementClick = useCallback((by: number) => {
    setClicks(v => v + by);
  }, [setClicks]);

  const value = useMemo(() => ({
    clicks,
    time,
    incrementClick,
  }), [clicks, time, incrementClick]);

  return <Provider value={value}>{children}</Provider>
}

const Clicker: React.FC = () => {
  console.log('Render CLICKER');
  const renderCount = useRenderCount();
  const { clicks, incrementClick } = useSelector(cb => ({clicks: cb.clicks, incrementClick: cb.incrementClick}));

  return (
    <div>
      <span>Clicks: {clicks} / Render: {renderCount}</span>
      <button onClick={() => incrementClick(1)}>Click Me</button>
    </div>
  );
}

const Timer: React.FC = () => {
  console.log('Render TIMER');
  const renderCount = useRenderCount();
  const time = useSelector(cb => cb.time);
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