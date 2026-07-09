import { useState, useRef, useEffect, useCallback } from "react";
import { useStopwatch } from "../hooks/useStopwatch";
import { useTimer } from "../hooks/useTimer";
import { Play, Pause } from "lucide-react";

// ---- geometria do dial (1 hora = 1 volta) ----
const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 92;
const STROKE = 10;
const HANDLE_R = 11;

function pointOnCircle(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  };
}

function describeArc(startAngle, endAngle, sweep = 1) {
  const start = pointOnCircle(startAngle);
  const end = pointOnCircle(endAngle);
  const largeArc = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

export default function TimeBlock() {
  const { seconds, isRunning, toggleStopwatch } = useStopwatch();
  const {
    seconds: timerSeconds,
    isRunning: timerRunning,
    toggleCountdown,
    setDuration,
  } = useTimer();

  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);

  // --- drag na bolinha do timer pra definir duração ---
  const angleFromPointer = useCallback((clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - CENTER;
    const y = clientY - rect.top - CENTER;
    let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    const minutes = Math.round((deg / 360) * 60);
    return minutes === 0 ? 60 : minutes;
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      const point = e.touches ? e.touches[0] : e;
      const minutes = angleFromPointer(point.clientX, point.clientY);
      setDuration(minutes * 60);
    },
    [dragging, angleFromPointer, setDuration],
  );

  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [dragging, handlePointerMove]);

  // --- ângulos ---
  const timerMinutes = (timerSeconds / 60) % 60;
  const timerEndAngle = -90 + (timerMinutes / 60) * 360;
  const timerHandle = pointOnCircle(timerEndAngle);

  const stopwatchMinutes = (seconds / 60) % 60;
  const stopwatchEndAngle = -90 - (stopwatchMinutes / 60) * 360;
  const stopwatchHandle = pointOnCircle(stopwatchEndAngle);

  return (
    <div className="time-block flex gap-10 flex-wrap items-center justify-center">
      {/* Stopwatch - reverso, repete a cada hora */}
      <div className="stopwatch flex flex-col items-center gap-3">
        <svg width={SIZE} height={SIZE}>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#4b4b52"
            strokeWidth={STROKE}
          />
          {seconds % 3600 > 0 && (
            <path
              d={describeArc(-90, stopwatchEndAngle, 0)}
              fill="none"
              stroke="#582d41"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          )}
          <text
            x={CENTER}
            y={CENTER + 8}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="24"
            fontWeight="700"
            fill={isRunning ? "#c084fc" : "#fff"}
          >
            {formatTime(seconds)}
          </text>
          <circle
            cx={stopwatchHandle.x}
            cy={stopwatchHandle.y}
            r={HANDLE_R}
            fill="#582d41"
            stroke="#0e0e0e"
            strokeWidth="2"
          />
        </svg>
        <button
          style={{
            backgroundColor: "transparent",
            border: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={toggleStopwatch}
        >
          {isRunning ? (
            <Pause className="action-button" />
          ) : (
            <Play className="action-button" />
          )}
        </button>
      </div>

      {/* Timer - arraste a bolinha pra definir a duração */}
      <div className="timer flex flex-col items-center gap-3">
        <svg ref={svgRef} width={SIZE} height={SIZE} className="touch-none">
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#4b4b52"
            strokeWidth={STROKE}
          />
          {timerSeconds % 3600 > 0 && (
            <path
              d={describeArc(-90, timerEndAngle, 1)}
              fill="none"
              stroke="#288830"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          )}
          <text
            x={CENTER}
            y={CENTER + 8}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="24"
            fontWeight="700"
            fill={timerRunning ? "#4ade80" : "#fff"}
          >
            {formatTime(timerSeconds)}
          </text>
          {!timerRunning && (
            <circle
              cx={timerHandle.x}
              cy={timerHandle.y}
              r={HANDLE_R}
              fill="#288830"
              stroke="#0e0e0e"
              strokeWidth="2"
              style={{ cursor: "grab" }}
              onPointerDown={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
            />
          )}
        </svg>
        <button
          style={{
            backgroundColor: "transparent",
            border: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
