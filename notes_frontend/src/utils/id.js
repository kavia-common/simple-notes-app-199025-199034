/**
 * Create a reasonably-unique id without additional dependencies.
 * Uses crypto.randomUUID when available, otherwise falls back to random+time.
 */

// PUBLIC_INTERFACE
export function createNoteId() {
  /** Returns a unique id string for a new note. */
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const rand = Math.random().toString(16).slice(2);
  const time = Date.now().toString(16);
  return `note_${time}_${rand}`;
}
