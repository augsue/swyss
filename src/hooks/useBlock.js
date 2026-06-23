import react, { useState } from "react";

export const useBlock = () => {
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

  return { blocks, setBlocks, addBlock, removeBlock };
};
