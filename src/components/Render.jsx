import { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useBlock } from "../hooks/useBlock";
import Block from "./Block";
import Sidebar from "./Sidebar";

export default function Render() {
  const { blocks, setBlocks, addBlock, removeBlock } = useBlock();

  // Converte pro formato do GridLayout
  const layout = blocks.map((block) => ({
    ...block,
    i: block.id,
  }));

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onAddBlock={addBlock} />
      <div className="grid">
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
            <div className="block" key={block.id}>
              <button
                onClick={() => removeBlock(block.id)}
                className="button-x"
                role="button"
              >
                ✕
              </button>
              <div className="move-sign">+</div>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
