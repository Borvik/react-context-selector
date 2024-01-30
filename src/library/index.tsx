import React from 'react';
import { createConsumer } from './consumer';
import { createHOCFunction } from './hoc';
import { createUseSelector } from './selectorHook';
import { createProvider } from './provider';
import { SelectorContext, SelectorInternalContext } from './types';
import { createUseGetter } from './useGetter';
import { createContextSetter } from './useSetter';
import { createUseState } from './stateHook';

export function createContext<T>(initialState: T): SelectorContext<T> {
  const ReactSelectorContext = React.createContext<SelectorInternalContext<T> | null>(null);

  if (process.env.NODE_ENV !== 'production') {
    ReactSelectorContext.displayName = 'ReactSelector';
  }

  const Provider = createProvider(ReactSelectorContext, initialState);
  const useSelector = createUseSelector(ReactSelectorContext);
  const Consumer = createConsumer(useSelector);
  const withSelector = createHOCFunction(Consumer);
  const useSetter = createContextSetter(ReactSelectorContext);
  const useGetter = createUseGetter(ReactSelectorContext);
  const useState = createUseState(ReactSelectorContext);

  return {
    Provider,
    Consumer,
    useSelector,
    withSelector,
    useSetter,
    useGetter,
    useState,
  };
}