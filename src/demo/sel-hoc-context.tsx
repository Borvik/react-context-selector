import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createContext } from '../library';

const { Provider, withSelector } = createContext({
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

class ClickerBase extends React.Component<any> {
  render() {
    console.log('Render CLICKER');
    const { selectorValue: { clicks, incrementClick } } = this.props;
    return (
      <div>
        <span>Clicks: {clicks}</span>
        <button onClick={() => incrementClick(1)}>Click Me</button>
      </div>
    );
  }
}
const Clicker = withSelector(cb => ({clicks: cb.clicks, incrementClick: cb.incrementClick}))(ClickerBase);

class TimerBase extends React.Component<any> {
  render() {
    console.log('Render TIMER');
    const { selectorValue: time } = this.props;
    return <div><span>Time: {time}</span></div>;
  }
}
const Timer = withSelector(cb => cb.time)(TimerBase);

export const TestApp: React.FC = () => {
  return (
    <TestContextProvider>
      <Clicker />
      <Timer />
    </TestContextProvider>
  )
}