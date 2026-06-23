import { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function Grid() {
  const [blocks, setBlocks] = useState([]);

  // Adiciona bloco
  const addBlock = () => {
    const newBlock = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      w: 5,
      h: 2.5,
    };
    setBlocks([...blocks, newBlock]);
  };

  // Remove bloco
  const removeBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  // Converte pro formato do GridLayout
  const layout = blocks.map((block) => ({
    ...block,
    i: block.id,
  }));

  return (
    // Layout principal
    <div
      style={{
        padding: "0px",
        margin: "0px",
        width: "100%",
      }}
    >
      {/* Botão para adicionar blocos */}
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          height: "40px",
          width: "100px",
        }}
        onClick={addBlock}
      >
        +
      </button>
      {/* Layout reativo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          overflow: "hidden",
          height: "calc(100vh - 80px)",
          width: "100%",
          margin: "20px",
        }}
      >
        <GridLayout
          layout={layout}
          onLayoutChange={(newLayout) => {
            setBlocks(
              newLayout.map(({ i, x, y, w, h }) => ({
                id: i,
                x,
                y,
                w,
                h,
              })),
            );
          }}
          cols={24}
          rowHeight={50}
          isDraggable={true}
          isResizable={true}
          width="1200"
          compactType="vertical"
          preventCollision={true}
        >
          {blocks.map((block) => (
            <div
              key={block.id}
              style={{
                background: "#333",
                border: "1px solid #fff",
                position: "relative",
              }}
            >
              Bloco {block.id}
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
