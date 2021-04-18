import { useCallback, useContext, useDebugValue, useRef, useState } from "react";
import { SelectorContext } from "./types";
import { EqualityCheckFn, simpleEqualityCheck } from "./utils/equality";
import { useIsomorphicLayoutEffect } from "./utils/useIsomorphicLayoutEffect";

type SelectorCallback<T, R> = (state: T) => R;

export function createUseSelector<T>(Context: React.Context<SelectorContext<T> | null>) {
  return function useSelector<R>(cb: SelectorCallback<T, R>, equalityFn: EqualityCheckFn = simpleEqualityCheck) {
    const store = useContext(Context);
    if (!store) {
      throw new Error('Cannot use `useSelector` outside of a Provider');
    }
  
    const [, forceRender] = useState(1);
    const selectorRef = useRef(cb);
    selectorRef.current = cb;
  
    const currentState = cb(store.getState());
    const selectedStateRef = useRef(currentState);
    selectedStateRef.current = currentState;
  
    const checkForUpdates = useCallback(() => {
      const newState = selectorRef.current(store.getState());
      const isEqual = equalityFn(selectedStateRef.current, newState);
      if (!isEqual) {
        forceRender(v => 0 - v);
      }
    }, [store]);
  
    useIsomorphicLayoutEffect(() => {
      return store.subscribe(checkForUpdates);
    }, [store, checkForUpdates]);

    useDebugValue(selectedStateRef.current);
    return selectedStateRef.current;
  }
}