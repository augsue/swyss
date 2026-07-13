import { useState, useEffect } from "react";

export const useBlock = () => {
  const [blocks, setBlocks] = useState(() => {
    const savedBlocks = localStorage.getItem("blocks");
    return savedBlocks ? JSON.parse(savedBlocks) : [];
  });

  useEffect(() => {
    localStorage.setItem("blocks", JSON.stringify(blocks));
  }, [blocks]);

  // Adiciona bloco
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      x: 0,
      y: 0,
      w: 5.2,
      h: 2,
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
