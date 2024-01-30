import React, { PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import { ProviderProps, SelectorInternalContext, SubscriberCallback, UnsubscribeCallback, UpdaterCallback } from './types';
import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect';

// type RefState<T> = {init: false} | {init: true, value: T};

// eslint-disable-next-line @typescript-eslint/ban-types
export function createProvider<T extends object>(Context: React.Context<SelectorInternalContext<T> | null>, initialState: T) {
  return function Provider({ children, value, initialValue }: PropsWithChildren<ProviderProps<T>>): JSX.Element {
    const originalValue = useRef<T>({
      ...initialState,
      ...initialValue,
    });

    const storeRef = useRef(value ?? originalValue.current);
    if (typeof value !== 'undefined') {
      storeRef.current = value;
    }
    const subscribersRef = useRef<SubscriberCallback[]>([]);
    const updaterRef = useRef<UpdaterCallback<T>>();
  
    useIsomorphicLayoutEffect(() => {
      // the original value shouldn't need to notify the subscribers
      if (originalValue.current === storeRef.current)
        return;
        
      // Notify all subscribers...
      subscribersRef.current.forEach(sub => sub());
    }, [value]);
  

    updaterRef.current = useCallback(
      (newState: (Partial<T> | ((state: T) => Partial<T>))) => {
        const publicState = typeof newState === 'function'
          ? (newState as any)(storeRef.current) as T
          : newState;

        storeRef.current = {
          ...storeRef.current,
          ...publicState,
        };

        // Notify all subscribers...
        subscribersRef.current.forEach(sub => sub());
      }, [storeRef, subscribersRef]
    );
    
    const contextValue = useMemo(() => ({
      subscribe: (cb: SubscriberCallback): UnsubscribeCallback => {
        subscribersRef.current.push(cb);
        return () => {
          subscribersRef.current = subscribersRef.current.filter(sub => sub !== cb);
        }
      },
      getState: () => storeRef.current,
      getUpdater: () => updaterRef.current!,
    }), []);
  
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
  }
}