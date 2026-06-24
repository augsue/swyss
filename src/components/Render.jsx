import { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useBlock } from "../hooks/useBlock";
import Block from "./Block";
import Sidebar from "./Sidebar";
import { Expand } from "lucide-react"

export default function Render() {
  const { blocks, setBlocks, addBlock, removeBlock, updateBlockContent } = useBlock();

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
            setBlocks((prevBlocks) => 
              prevBlocks.map((block) => {
                const layoutItem = newLayout.find((item) => item.i === block.id);
                return layoutItem
                  ? {...block, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h}
                  : block
              })
            )
          }
          maxCols={4}
          maxRows={4}
          rowHeight={50}
          isDraggable={true}
          isResizable={true}
          width={1850}
          heigth={30}
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
              <Block
                key={block.id}
                id={block.id}
                type={block.type} 
                content={block.content}
                onChange={(newContent) => updateBlockContent(block.id, newContent)}
              />
              <div className="move-sign"><Expand color="#c6d8d3" size={15} /></div>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
