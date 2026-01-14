import React from "react";

// PUBLIC_INTERFACE
function SearchBar({ value, onChange, placeholder, ariaLabel }) {
  /** Controlled search input for filtering notes by title. */
  return (
    <input
      className="Input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}

export default SearchBar;
