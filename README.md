# react-selector-context

What is `react-selector-context`?

Simply put, it provides for the ability to use a react context in a more redux and state like manner.

There is one big advantage to using some like react-redux. Re-render performance.

With react-redux, any changes to the global state only trigger rerenders to the components listening _to the portion that changed_ - all while still being "one context".

With the standard context provided by react, _any component_ that uses the context (the consumer or the `useContext` hook) re-renders any time anything on the context changed.

This attempts to bring the re-render performance of react-redux to a react context.

This component and examples were inspired by an article by [Daniel Merrill](https://medium.com/async-la/how-useselector-can-trigger-an-update-only-when-we-want-it-to-a8d92306f559).

# Usage

The usage is very similar to the usage to a mix of the context api and state, which you can read [in their documentation](https://reactjs.org/docs/context.html).

The difference, you cannot use a context created via the context api, specifically you can't use the `useContext` hook nor `static contextType`.  The context created here also returns a `useSelector` hook and a `withSelector` method tied to this context.  It also returns a `useSetter`, `useGetter` and a `useState`.

```tsx
import { createContext } from '@borvik/react-selector-context';

const { Provider, Consumer, useSelector, withSelector } = createContext({
  clicks: 0,
  time: 0,
  incrementClick: (_: number) => {},
});
```

`createContext` takes as it's only parameter the initial state of context - which behaves slightly differently than the built-in.  With the built-in api, the initial state provided here is used when a `Provider` component isn't rendered.  With this one, the `Provider` component is _required_, and the initial state is used if a value is not passed to the `Provider`.

With the exception of the `value` now being optional - the usage of the `Provider` is essentially the same.

```tsx
const SomeComponent: React.FC = ({ children }) => {
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
```

`createContext` also returns a paired `useSelector` hook. This hook is similar to the same hook found in `react-redux` and takes a single callback function to return the parts of the context you are interested in.

```tsx
const Clicker: React.FC = ({}) => {
  const { clicks, incrementClick } = useSelector(cb => ({clicks: cb.clicks, incrementClick: cb.incrementClick}));

  return (
    <div>
      <span>Clicks: {clicks}</span>
      <button onClick={() => incrementClick(1)}>Click Me</button>
    </div>
  );
}
```

Here is an example using the `Consumer`.

```tsx
const Timer: React.FC = () => {
  return <div>
    <Consumer selector={cb => cb.time}>
      {(time) => (<span>Time: {time}</span>)}
    </Consumer>
  </div>;
}
```

And an example using `withSelector` as a higher-order-component.

```tsx
class TimerBase extends React.Component<any> {
  render() {
    console.log('Render TIMER');
    const { selectorValue: time } = this.props;
    return <div><span>Time: {time}</span></div>;
  }
}
const Timer = withSelector(cb => cb.time)(TimerBase);
```

But, `createContext` here also returns some state-like functions `useGetter`, `useSetter`, and `useState`.

`useGetter` returns a fuction that will give you the full current state from the provider.  This can be useful in event handlers where you don't really need your component to rerender as the state changes - but temporarily grabbing data to do validation is handy. Currently I don't have a proper example of this.

`useSetter` returns a function that allows you to alter the data inside the provider. You may specify a partial state, or a callback function that receives the current state and returns a partial state - just like React's built-in setState (for class components).

`useState` (not to be confused with React's version) takes selector callback function to get just the data you want, just like the `useSelector` - but, it returns a tuple, containing first the data you requested, but also the same setting function from `useSetter`.

```tsx
const { Provider, useState: useClickState } = createContext({
  clicks: 0,
  time: 0,
});

const Clicker: React.FC = () => {
  const [clicks, setClickState] = useClickState(cb => cb.clicks);

  return (
    <div>
      <span>Clicks: {clicks}</span>
      <button onClick={() => setClickState(p => ({ clicks: p.clicks + 1 }))}>Click Me</button>
    </div>
  );
}
```