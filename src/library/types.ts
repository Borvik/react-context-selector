export type UnsubscribeCallback = () => void;
export type SubscriberCallback = () => void;
export interface SelectorContext<T = any> {
  subscribe: (cb: SubscriberCallback) => UnsubscribeCallback
  getState: () => T
}