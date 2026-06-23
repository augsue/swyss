import { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useBlock } from "../hooks/useBlock";
import Block from "./Block";

export default function Render() {
  const { blocks, setBlocks, addBlock, removeBlock } = useBlock();

  // Converte pro formato do GridLayout
  const layout = blocks.map((block) => ({
    ...block,
    i: block.id,
  }));

  return (
    <div style={{ display: "flex" }}>
      <div className="sidebar">
      <button
        onClick={addBlock}
        style={{ padding: "10px 20px", margin: "10px" }}
      >
        +
      </button>
      </div>
      <div style={{ display: "inline-block", height: "calc(100vh - 100px)" }}>
        <GridLayout
          layout={layout}
          onLayoutChange={(newLayout) =>
            setBlocks(
              newLayout.map(({ i, x, y, w, h }) => ({ id: i, x, y, w, h })),
            )
          }
          maxCols={4}
          maxRows={4}
          rowHeight={50}
          isDraggable={true}
          isResizable={true}
          width={window.innerWidth}
          heigth={window.innerHeight}
          preventCollision={true}
        >
          {blocks.map((block) => (
            <div
              key={block.id}
              style={{
                background: "#",
                border: "2px solid #FDF0D5",
                borderRadius: "5px",
                position: "relative",
              }}
            >
              <button
                onClick={() => removeBlock(block.id)}
                style={{ position: "absolute", top: "5px", right: "5px" }}
              >
                ✕
              </button>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
