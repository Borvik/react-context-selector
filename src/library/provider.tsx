import React, { PropsWithChildren, useMemo, useRef } from 'react';
import { SelectorContext, SubscriberCallback, UnsubscribeCallback } from './types';
import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect';

export interface ProviderProps<T> {
  value?: T
}

export function createProvider<T>(Context: React.Context<SelectorContext<T> | null>, initialState: T) {
  return function Provider({ children, value }: PropsWithChildren<ProviderProps<T>>) {
    const storeRef = useRef(value ?? initialState);
    storeRef.current = value ?? initialState;
  
    const subscribersRef = useRef<SubscriberCallback[]>([]);
  
    useIsomorphicLayoutEffect(() => {
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