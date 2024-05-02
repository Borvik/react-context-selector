import React from 'react';
import { ConsumerProps, UseSelectorHookDef } from './types';

export function createConsumer<T>(useSelector: UseSelectorHookDef<T>) {
  return function Consumer<R>({ children, selector, equalityFn }: ConsumerProps<T, R>): React.ReactElement<any, any> | null {
    const value = useSelector<R>(selector, equalityFn);
    if (!children) return null;
    return children(value);
  };
}