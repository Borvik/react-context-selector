import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createContext } from '../library';

const { Provider, Consumer } = createContext({
  clicks: 0,
  time: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  incrementClick: (_: number) => {},
})

const TestContextProvider: React.FC = ({ children }) => {
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
  return (
    <div>
      <Consumer selector={(cb) => ({clicks: cb.clicks, incrementClick: cb.incrementClick})}>
        {({ clicks, incrementClick }) => {
        console.log('Render CLICKER');
          return (<>
            <span>Clicks: {clicks}</span>
            <button onClick={() => incrementClick(1)}>Click Me</button>
          </>);
        }}
      </Consumer>
    </div>
  );
}

const Timer: React.FC = () => {
  return <div>
    <Consumer selector={cb => cb.time}>
      {(time) => {
        console.log('Render TIMER');
        return (<span>Time: {time}</span>);
      }}
    </Consumer>
  </div>;
}

export const TestApp: React.FC = () => {
  return (
    <TestContextProvider>
      <Clicker />
      <Timer />
    </TestContextProvider>
  )
}