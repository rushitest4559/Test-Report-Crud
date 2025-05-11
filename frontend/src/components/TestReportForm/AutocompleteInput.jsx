import React, { useState, useRef } from "react";

export default function AutocompleteInput({
  value,
  onChange,
  fetchSuggestions,
  placeholder,
  name,
  getSuggestionValue = v => v,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const timeout = useRef();

  async function handleInput(e) {
    const val = e.target.value;
    onChange(val);
    if (timeout.current) clearTimeout(timeout.current);
    if (!val) {
      setSuggestions([]);
      setShow(false);
      return;
    }
    timeout.current = setTimeout(async () => {
      const list = await fetchSuggestions(val);
      setSuggestions(list);
      setShow(true);
    }, 200); // debounce
  }

  function handleSelect(sug) {
    onChange(getSuggestionValue(sug));
    setSuggestions([]);
    setShow(false);
  }

  return (
    <div className="autocomplete-wrapper" style={{ position: "relative" }}>
      <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        autoComplete="off"
        onBlur={() => setTimeout(() => setShow(false), 100)}
        onFocus={e => value && suggestions.length && setShow(true)}
        required
      />
      {show && suggestions.length > 0 && (
        <ul className="autocomplete-list" style={{
          position: "absolute",
          left: 0, right: 0, top: "100%",
          zIndex: 10,
          background: "#fff",
          border: "1px solid #b3c0d1",
          borderRadius: 5,
          maxHeight: 180,
          overflowY: "auto",
          margin: 0, padding: 0, listStyle: "none"
        }}>
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              style={{ padding: "0.5rem", cursor: "pointer" }}
              onMouseDown={() => handleSelect(sug)}
            >
              {getSuggestionValue(sug)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
