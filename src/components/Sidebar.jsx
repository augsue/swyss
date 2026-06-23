const Sidebar = ({onAddBlock}) => {
   return (
      <div className="sidebar">
      <button
        onClick={onAddBlock}
      >
        +
      </button>
      </div>
   );
}

export default Sidebar;