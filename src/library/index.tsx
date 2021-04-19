import React from 'react';
import { createConsumer } from './consumer';
import { createHOCFunction } from './hoc';
import { createUseSelector } from './hook';
import { createProvider } from './provider';
import { SelectorContext, SelectorInternalContext } from './types';

export function createContext<T>(initialState: T): SelectorContext<T> {
  const ReactSelectorContext = React.createContext<SelectorInternalContext<T> | null>(null);

  if (process.env.NODE_ENV !== 'production') {
    ReactSelectorContext.displayName = 'ReactSelector';
  }

  const Provider = createProvider(ReactSelectorContext, initialState);
  const useSelector = createUseSelector(ReactSelectorContext);
  const Consumer = createConsumer(useSelector);
  const withSelector = createHOCFunction(Consumer);

  return {
    Provider,
    Consumer,
    useSelector,
    withSelector,
  };
}