# react-selector-context

What is `react-selector-context`?

Simply put, it provides for the ability to use a react context in a more redux like manner.

There is one big advantage to using some like react-redux. Re-render performance.

With react-redux, any changes to the global state only trigger rerenders to the components listening _to the portion that changed_ - all while still being "one context".

With the standard context provided by react, _any component_ that uses the context (the consumer or the `useContext` hook) re-renders any time anything on the context changed.

This attempts to bring the re-render performance of react-redux to a react context.

This component and examples were inspired by an article by [Daniel Merrill](https://medium.com/async-la/how-useselector-can-trigger-an-update-only-when-we-want-it-to-a8d92306f559).

# Usage

The usage is very similar to the usage of the context api, which you can read [in their documentation](https://reactjs.org/docs/context.html).

The difference, you cannot use a context created via the context api, specifically you can't use the `useContext` hook nor `static contextType`.  The context created here also returns a hook tied to this context.

```tsx
import { createContext } from '@borvik/react-selector-context';

const { Provider, Consumer, useSelector } = createContext({
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