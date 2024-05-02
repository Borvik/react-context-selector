import React, { PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRenderCount } from './useRenderCount';

const TestContext = React.createContext({
  clicks: 0,
  time: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  incrementClick: (_: number) => {},
});

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

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>
}

const Clicker: React.FC = () => {
  console.log('Render CLICKER');
  const renderCount = useRenderCount();
  const { clicks, incrementClick } = useContext(TestContext);

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
  const { time } = useContext(TestContext);
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