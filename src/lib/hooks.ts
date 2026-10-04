"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";

function subscribeReduced(callback: () => void) {
  const mq = window.matchMedia(reducedQuery);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** True when the visitor has asked the OS for less motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

/**
 * Steps a counter from 0 to `last`, one tick every `stepMs`. Used by the diagrams to
 * walk a request through its stages after the visitor picks a scenario.
 * With reduced motion it jumps straight to the end.
 *
 * `position` is the index of the stage currently being evaluated; it equals `last + 1`
 * once the run is complete.
 */
export function useStepper(stepMs: number) {
  const reduced = useReducedMotion();
  const [position, setPosition] = useState(Number.POSITIVE_INFINITY);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const stop = useCallback(() => {
    if (timer.current !== undefined) window.clearInterval(timer.current);
    timer.current = undefined;
  }, []);

  const run = useCallback(
    (last: number) => {
      stop();
      if (reduced) {
        setPosition(last + 1);
        setRunning(false);
        return;
      }
      setPosition(0);
      setRunning(true);
      let i = 0;
      timer.current = window.setInterval(() => {
        i += 1;
        setPosition(i);
        if (i > last) {
          stop();
          setRunning(false);
        }
      }, stepMs);
    },
    [reduced, stepMs, stop],
  );

  useEffect(() => stop, [stop]);

  return { position, running, run };
}
