import React, { PropsWithChildren, useMemo, useRef } from 'react';
import { ProviderProps, SelectorInternalContext, SubscriberCallback, UnsubscribeCallback } from './types';
import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect';

type RefState<T> = {init: false} | {init: true, value: T};

export function createProvider<T>(Context: React.Context<SelectorInternalContext<T> | null>, initialState: T) {
  return function Provider({ children, value }: PropsWithChildren<ProviderProps<T>>): JSX.Element {
    const originalValue = useRef<RefState<T>>({ init: false });

    const storeRef = useRef(value ?? initialState);
    storeRef.current = value ?? initialState;
    // const storeRef = useRef<RefState<unknown>>({ init: false });
    const subscribersRef = useRef<SubscriberCallback[]>([]);

    if (!originalValue.current.init) {
      originalValue.current = { init: true, value: storeRef.current };
    }
  
    useIsomorphicLayoutEffect(() => {
      // the original value shouldn't need to notify the subscribers
      if (originalValue.current.init && originalValue.current.value === storeRef.current)
        return;
        
      // Notify all subscribers...
      subscribersRef.current.forEach(sub => sub());
    }, [value]);
  
    const contextValue = useMemo(() => ({
      subscribe: (cb: SubscriberCallback): UnsubscribeCallback => {
        subscribersRef.current.push(cb);
        return () => {
          subscribersRef.current = subscribersRef.current.filter(sub => sub !== cb);
        }
      },
      getState: () => storeRef.current
    }), []);
  
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
  }
}