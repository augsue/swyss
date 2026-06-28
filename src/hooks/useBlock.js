import react, { useState } from "react";

export const useBlock = () => {
  const [blocks, setBlocks] = useState([]);

  // Adiciona bloco
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      x: 0,
      y: 0,
      w: 4,
      h: 1,
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
