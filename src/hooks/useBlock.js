import { useState, useEffect } from "react";

export const useBlock = () => {
  const [blocks, setBlocks] = useState(() => {
    const savedBlocks = localStorage.getItem("blocks");
    return savedBlocks ? JSON.parse(savedBlocks) : [
      { id: "1", type: "note", x: 5, y: 2, w: 5, h: 2, content: "" },
      { id: "2", type: "todo", x: 0, y: 2, w: 5, h: 4, content: "" },
      { id: "3", type: "palette-generator", x: 5, y: 4, w: 5, h: 2, content: "" },
      { id: "4", type: "timer", x: 0, y: 0, w: 10, h: 2, content: "" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("blocks", JSON.stringify(blocks));
  }, [blocks]);
  
  // Adiciona bloco
  const addBlock = (type) => {
    
      const sizeDefaults = {
        note: { w: 5, h: 2 },
        todo: { w: 5, h: 4 },
        "palette-generator": { w: 5, h: 2 },
        timer: { w: 10, h: 2 },
      }
    
      const size = sizeDefaults[type] || { w: 5.2, h: 2 };
    
    const newBlock = {
      id: Date.now().toString(),
      type,
      x: 0,
      y: 0,
      ...size,
      content: "",
    };
    setBlocks([...blocks, newBlock]);
  };
  // Adiciona Conteudo
 const updateBlockContent = (id, newContent) => {
   setBlocks(
    blocks.map((block) =>
     block.id === id ? { ...block, content: newContent } : block
    )
   )
 }

  // Remove bloco
  const removeBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  // Converte pro formato do GridLayout
  const layout = blocks.map((block) => ({
    ...block,
    i: block.id,
  }));

  return { blocks, setBlocks, addBlock, removeBlock, updateBlockContent };
};
