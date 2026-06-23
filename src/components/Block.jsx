const Block = ({ id, onRemove }) => {
  return (
    <div
      style={{
        background: "#333",
        border: "1px solid #fff",
        position: "relative",
      }}
    >
        Bloco {id}
      <button
        onClick={() => onRemove(id)}
        style={{ position: "absolute", top: "5px", right: "5px" }}
      >
        ✕
      </button>
    </div>
  );
};

export default Block;