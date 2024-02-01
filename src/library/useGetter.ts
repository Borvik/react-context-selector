import { useCallback, useContext } from "react";
import type { SelectorInternalContext } from "./types";

export function createUseGetter<T>(Context: React.Context<SelectorInternalContext<T> | null>) {
  return function useGetter(): (() => T) {
    const store = useContext(Context);
    if (!store) {
      throw new Error('Cannot use `useSelector` outside of a Provider');
    }

    const getStoreData = useCallback(() => {
      return store.getState();
    }, [store])
  
    return getStoreData;
  }
}