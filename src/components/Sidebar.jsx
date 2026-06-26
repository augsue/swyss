import { useState } from "react";
import { SquarePen, List, Layers, Timer } from "lucide-react"

const Sidebar = ({ onAddBlock }) => {
  return (
    <div className="sidebar">
      <button onClick={() => onAddBlock("note")} className="button-tool">
        <SquarePen color="#c6d8d3" size={21}></SquarePen>
      </button>
      <button onClick={() => onAddBlock("todo")} className="button-tool">
        <List color="#c6d8d3" size={21}></List>
      </button>
      <button onClick={() => onAddBlock("palette-generator")} className="button-tool">
        <Layers color="#c6d8d3" size={21}></Layers>
      </button>
      <button onClick={() => onAddBlock("timer")} className="button-tool">
        <Timer color="#c6d8d3" size={21}></Timer>
      </button>
    </div>
  );
};

export default Sidebar;
