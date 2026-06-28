import { useState, useEffect } from "react";

export function useTimer() {
    const [seconds, setSeconds] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        if (!isRunning || seconds <= 0) return;
    
        const interval = setInterval(() => {
            setSeconds(prev => prev -1);
        }, 1000)

        return () => clearInterval(interval);
    }, [isRunning, seconds]);

    const toggleCountdown = () => {
        setIsRunning(!isRunning);
    };

    const setDuration = (sec) => {
        setSeconds(sec);
        setIsRunning(false)
    }

    return { seconds, isRunning, toggleCountdown, setDuration };
}