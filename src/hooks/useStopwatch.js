import { useState, useEffect } from "react";

export function useStopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleStopwatch = () => {
    setIsRunning(!isRunning);
  };

  return { seconds, isRunning, toggleStopwatch };
}