/* eslint-disable @typescript-eslint/ban-types */
import React, { ComponentType } from 'react';
import { EqualityCheckFn, SelectorCallback, UseSelectorHookDef } from './types';

export function createHOCFunction<T>(useSelector: UseSelectorHookDef<T>) {
  return function withSelector<R>(
    selector: SelectorCallback<T, R>,
    equalityFn?: EqualityCheckFn
  ) {
    return <P extends object>(WrappedComponent: ComponentType<P & {selectorValue: R}>) => {
      const SelectorContextComponent: React.FC<P> = function SelectorContextComponent(props: P) {
        const value = useSelector<R>(selector, equalityFn);
        return <WrappedComponent {...props} selectorValue={value} />
      }
      return SelectorContextComponent;
    };
  }
}