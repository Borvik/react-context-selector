import { useRef } from "react";

export function useRenderCount() {
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;
  return renderCounter.current;
}