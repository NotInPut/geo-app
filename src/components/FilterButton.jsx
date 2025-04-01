//filter.jsx

function FilterButton({ name, isPressed, setFilter }) {
  return (
    <button
      type="button"
      className={`btn toggle-btn ${isPressed ? "toggle-btn-active" : ""}`}
      aria-pressed={isPressed}
      onClick={() => setFilter(name)}
    >
      <span>{name}</span>
    </button>
  );
}

export default FilterButton;