import { useEffect, useState } from "react";

/**
 * Load JSON from localStorage safely.
 * @param {string} key
 * @param {any} fallback
 * @returns {any}
 */
function safeLoad(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Save JSON to localStorage safely.
 * @param {string} key
 * @param {any} value
 */
function safeSave(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write errors (quota, private mode, etc.)
  }
}

// PUBLIC_INTERFACE
export function useLocalStorage(key, initialValue, normalize) {
  /**
   * React hook like useState but persisted in localStorage (single key).
   * @param {string} key localStorage key
   * @param {any} initialValue default if missing
   * @param {(value:any)=>any} [normalize] optional normalizer for loaded data
   * @returns {[any, Function]}
   */
  const [value, setValue] = useState(() => {
    const loaded = safeLoad(key, initialValue);
    return typeof normalize === "function" ? normalize(loaded) : loaded;
  });

  useEffect(() => {
    safeSave(key, value);
  }, [key, value]);

  return [value, setValue];
}
