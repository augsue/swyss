import { AArrowUp, AArrowDown } from "lucide-react";
import { useState } from "react";
import ToDoList  from "./ToDoList";

const Block = ({ id, type, content, onChange, onRemove }) => {
  const [fontSize, setFontSize] = useState(14);
  //Renderizaçao de conteudo

  const renderContent = () => {
    if (type === "note") {
      return (
        <div className="note-toolbar">
          <textarea
            className="block-textarea"
            style={{ fontSize: `${fontSize}px` }}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escreva sua nota..."
          ></textarea>
          <button
            className="font-button a-down"
            onClick={() => setFontSize((f) => Math.max(8, f - 2))}
          >
            <AArrowDown />
          </button>
          <button
            className="font-button a-up"
            onClick={() => setFontSize((f) => Math.min(40, f + 2))}
          >
            <AArrowUp />
          </button>
        </div>
      );
    }
    if (type === "todo") {
      return (
        <div> <ToDoList /> </div>
      );
    }

    return (
      <div className="block-placeholder">
        Eu sirvo pra: {type} e meu ID e {id}
      </div>
    );
  };

  return (
  <div
    style={{
      height: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}
  >
    {renderContent()}
  </div>
);
};

export default Block;
