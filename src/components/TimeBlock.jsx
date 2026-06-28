import { useState } from "react";
import { useStopwatch } from "../hooks/useStopwatch";
import { useTimer } from "../hooks/useTimer";
import { Play, Pause } from "lucide-react";

export default function TimeBlock() {
  const { seconds, isRunning, toggleStopwatch } = useStopwatch();
  const {
    seconds: timerSeconds,
    isRunning: timerRunning,
    toggleCountdown,
    setDuration,
  } = useTimer();
  const [timerInput, setTimerInput] = useState(0);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="time-block">
      <div className="stopwatch">
        <div className="stopwatch-time">{formatTime(seconds)}</div>
        <button
          style={{ backgroundColor: "transparent", border: 0 }}
          onClick={toggleStopwatch}
        >
          {isRunning ? (
            <Pause className="action-button" />
          ) : (
            <Play className="action-button" />
          )}
        </button>
      </div>

      <div className="timer">
        <input
          type="text"
          value={formatTime(timerSeconds)}
          onChange={(e) => {
            const input = e.target.value.replace(/:/g, "");
            let totalSeconds = 0;
            if (input.length <= 2) {
              totalSeconds = Number(input);
            } else if (input.length <= 4) {
              totalSeconds =
                Number(input.slice(0, -2)) * 60 + Number(input.slice(-2));
            } else {
              totalSeconds =
                Number(input.slice(0, -4)) * 3600 +
                Number(input.slice(-4, -2)) * 60 +
                Number(input.slice(-2));
            }
            if (!isNaN(totalSeconds)) setDuration(totalSeconds);
          }}
          disabled={timerRunning}
          style={{
            fontSize: "48px",
            textAlign: "center",
            background: "transparent",
            border: "none",
            color: "#fff",
            width: "100%",
          }}
        />
        <button
          style={{ backgroundColor: "transparent", border: 0 }}
          onClick={toggleCountdown}
        >
          {timerRunning ? (
            <Pause className="action-button" />
          ) : (
            <Play className="action-button" />
          )}
        </button>
      </div>
    </div>
  );
}
