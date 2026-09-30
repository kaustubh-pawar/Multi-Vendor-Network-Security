'use client';

import { useEffect, useRef, useState } from 'react';

export function useInterval(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return undefined;

    const intervalId = window.setInterval(() => callbackRef.current(), delay);
    return () => window.clearInterval(intervalId);
  }, [delay]);
}

export function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const safeDuration = Math.max(duration, 0);

    const updateValue = (currentTime: number) => {
      const progress = safeDuration === 0
        ? 1
        : Math.min((currentTime - startTime) / safeDuration, 1);

      setValue(Math.round(target * progress));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(updateValue);
      }
    };

    setValue(0);
    animationFrameId = window.requestAnimationFrame(updateValue);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return value;
}

interface TypewriterState {
  displayed: string;
  complete: boolean;
}

export function useTypewriter(text: string, speed = 40, initialDelay = 0): TypewriterState {
  const [displayed, setDisplayed] = useState('');
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let intervalId: number | undefined;
    const safeSpeed = Math.max(speed, 0);

    setDisplayed('');
    setComplete(text.length === 0);

    const startTyping = () => {
      let index = 0;

      const addCharacter = () => {
        index += 1;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          setComplete(true);
          if (intervalId !== undefined) window.clearInterval(intervalId);
        }
      };

      if (text.length === 0) return;

      if (safeSpeed === 0) {
        setDisplayed(text);
        setComplete(true);
        return;
      }

      intervalId = window.setInterval(addCharacter, safeSpeed);
    };

    const timeoutId = window.setTimeout(startTyping, Math.max(initialDelay, 0));

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [text, speed, initialDelay]);

  return { displayed, complete };
}
