import React from "react";

export type UnsubscribeCallback = () => void;
export type SubscriberCallback = () => void;
export interface SelectorInternalContext<T = any> {
  subscribe: (cb: SubscriberCallback) => UnsubscribeCallback
  getState: () => T
}

export interface ProviderProps<T> {
  value?: T
}
export type ProviderType<T> = React.FC<ProviderProps<T>>;

export type SelectorCallback<T, R> = (state: T) => R;
export type UseSelectorHookDef<T> = <R>(cb: SelectorCallback<T, R>, equalityFn?: (a: unknown, b: unknown) => boolean) => R

export interface SelectorContext<T> {
  Provider: ProviderType<T>
  useSelector: UseSelectorHookDef<T>
}