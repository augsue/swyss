import { useState } from "react";

const usePalette = () => {
  const [colors, setColors] = useState([]);
  const [selectedCount, setSelectedCount] = useState(5);

  const generatePalette = async () => {
    try {
      const response = await fetch(
        "https://colormind.io/api/",
        {
          method: "POST",
          body: JSON.stringify({ model: "default" }),
        },
      );
      const data = await response.json();

      if (data.result) {
        const rgbColors = data.result.map(([r, g, b]) => {
          const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          return hex.length === 7 ? hex : "#000000";
        });
        setColors(rgbColors);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return {
    colors: colors.slice(0, selectedCount),
    selectedCount,
    setSelectedCount,
    generatePalette,
  };
};

export default usePalette;