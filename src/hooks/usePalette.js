import { useState } from "react";

const usePalette = () => {
    const [colors, setColors] = useState([])
    const [lockedColors, setLockedColors] = useState([false, false, false, false, false])
    const [selectedCount, setSelectedCount] = useState(5)

const generatePalette = async () => {
  const input = colors.map((color, i) => 
    lockedColors[i] ? parseInt(color.slice(1), 16) : "N"
  );

  try {
    const response = await fetch("http://colormind.io/api/", {
      method: "POST",
      body: JSON.stringify({ input, model: "default" })
    });
    const data = await response.json();
    
    if (data.result) {
      const rgbColors = data.result.map(
        ([r, g, b]) => {
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          return hex.length === 7 ? hex : "#000000"; // valida
        }
      );
      setColors(rgbColors);
    }
  } catch (error) {
    console.error("Erro:", error);
  }
};

const toggleLock = (index) => {
    setLockedColors(prev => {
        const newLocked = [...prev];
        newLocked[index] = !newLocked[index];
        return newLocked;
    });
};

return {
    colors: colors.slice(0, selectedCount),
    lockedColors: lockedColors.slice(0, selectedCount),
    selectedCount,
    setSelectedCount,
    generatePalette,
    toggleLock
};
}

export default usePalette