import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

// ---- shared geometry ----
const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 92;
const STROKE = 10;
const HANDLE_R = 11;
const TOTAL_SECONDS = 3600; // 1 hour

function angleFromMinutes(minutes) {
  // 0 min = 12 o'clock, clockwise
  return (minutes / 60) * 360 - 90;
}

function pointOnCircle(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  };
}

function describeArc(startAngle, endAngle) {
  const start = pointOnCircle(startAngle);
  const end = pointOnCircle(endAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ---- circular countdown timer ----
function CircularCountdownTimer() {
  const [durationSec, setDurationSec] = useState(15 * 60); // set via drag
  const [remainingSec, setRemainingSec] = useState(15 * 60);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemainingSec((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const angleFromPointer = useCallback((clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - CENTER;
    const y = clientY - rect.top - CENTER;
    let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    const minutes = Math.round((deg / 360) * 60);
    return minutes === 0 ? 60 : minutes; // let full lap = 60 min
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      const point = e.touches ? e.touches[0] : e;
      const minutes = angleFromPointer(point.clientX, point.clientY);
      const seconds = minutes * 60;
      setDurationSec(seconds);
      setRemainingSec(seconds);
    },
    [dragging, angleFromPointer]
  );

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", () => setDragging(false));
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", () => setDragging(false));
    };
  }, [dragging, handlePointerMove]);

  const progressMinutes = (remainingSec / 60) % 60 || (remainingSec > 0 ? 60 : 0);
  const endAngle = angleFromMinutes(progressMinutes === 0 && remainingSec > 0 ? 60 : progressMinutes);
  const startAngle = -90;
  const handlePos = pointOnCircle(endAngle);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <svg
        ref={svgRef}
        width={SIZE}
        height={SIZE}
        className="touch-none"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth={STROKE}
        />
        {remainingSec > 0 && (
          <path
            d={describeArc(startAngle, endAngle)}
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
          fontSize="28"
          fontWeight="700"
          fill={running ? "#4ade80" : "#e5e5e5"}
        >
          {formatTime(remainingSec)}
        </text>
        {!running && (
          <circle
            cx={handlePos.x}
            cy={handlePos.y}
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

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (remainingSec === 0) return;
            setRunning((r) => !r);
          }}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-[#288830] text-white hover:opacity-90 transition disabled:opacity-40"
          disabled={remainingSec === 0}
        >
          {running ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setRemainingSec(durationSec);
          }}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-[#2a2a2a] text-[#e5e5e5] hover:bg-[#333] transition"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <span className="text-xs text-[#777] font-mono">arraste a bolinha para definir o tempo</span>
    </div>
  );
}

// ---- circular stopwatch (reverse, loops every hour) ----
function CircularStopwatch() {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsedSec((prev) => (prev + 1) % TOTAL_SECONDS);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const minutesElapsed = (elapsedSec / 60) % 60;
  // reverse direction: counter-clockwise from 12 o'clock
  const endAngle = -90 - (minutesElapsed / 60) * 360;
  const startAngle = -90;
  const handlePos = pointOnCircle(endAngle);

  // build reverse arc path (counter-clockwise sweep flag = 0)
  const arcPath = (() => {
    const start = pointOnCircle(startAngle);
    const end = pointOnCircle(endAngle);
    const largeArc = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  })();

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <svg width={SIZE} height={SIZE}>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth={STROKE}
        />
        {elapsedSec > 0 && (
          <path
            d={arcPath}
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
          fontSize="28"
          fontWeight="700"
          fill={running ? "#c084fc" : "#e5e5e5"}
        >
          {formatTime(elapsedSec)}
        </text>
        <circle
          cx={handlePos.x}
          cy={handlePos.y}
          r={HANDLE_R}
          fill="#582d41"
          stroke="#0e0e0e"
          strokeWidth="2"
        />
      </svg>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-[#582d41] text-white hover:opacity-90 transition"
        >
          {running ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setElapsedSec(0);
          }}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-[#2a2a2a] text-[#e5e5e5] hover:bg-[#333] transition"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <span className="text-xs text-[#777] font-mono">roda ao contrário, reinicia a cada hora</span>
    </div>
  );
}

export default function CircularTimerWidget() {
  return (
    <div className="w-full min-h-[420px] flex items-center justify-center gap-10 flex-wrap bg-[#141414] p-8 rounded-xl">
      <CircularCountdownTimer />
      <CircularStopwatch />
    </div>
  );
}
