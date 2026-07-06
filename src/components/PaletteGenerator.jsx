import usePalette from "../hooks/usePalette";
import { useEffect } from "react";
import { ClipboardCopy, CopyPlus, CopyMinus, RefreshCcw } from "lucide-react";

export default function PaletteGenerator() {
  const {
    colors,
    lockedColors,
    selectedCount,
    setSelectedCount,
    generatePalette,
    toggleLock,
  } = usePalette();
  useEffect(() => {
    generatePalette();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <button
        className="action-button a-down"
        onClick={() => setSelectedCount(Math.max(1, selectedCount - 1))}
      >
        <CopyMinus />
      </button>
      <button
        className="action-button a-up"
        onClick={() => setSelectedCount(Math.min(5, selectedCount + 1))}
      >
        <CopyPlus />
      </button>
      <button
        className="action-button a-refresh"
        onClick={generatePalette}
      >
        <RefreshCcw />
      </button>

      <div
        style={{
          display: "flex",
          gap: "5px",
          padding: "10px",
          flex: 1,
        }}
      >
        {colors.map((color, i) => (
          <div
            key={i}
            style={{
              background: color,
              flex: 1,
              height: "100vh",
            }}
          >
            <div
              style={{
                color: "#fff",
                textAlign: "center",
                paddingTop: "10px",
                fontSize: "14px",
              }}
            >
              {color}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(color)}
              className="action-button"
              style={{
                position: "relative",
              }}
            >
              <ClipboardCopy />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
