import React from 'react';
import { createUseSelector } from './hook';
import { createProvider } from './provider';
import { SelectorContext } from './types';

export function createContext<T>(initialState: T) {
  const ReactSelectorContext = React.createContext<SelectorContext<T> | null>(null);

  if (process.env.NODE_ENV !== 'production') {
    ReactSelectorContext.displayName = 'ReactSelector';
  }

  const Provider = createProvider(ReactSelectorContext, initialState);
  const useSelector = createUseSelector(ReactSelectorContext);

  return {
    Provider,
    useSelector,
  };
}