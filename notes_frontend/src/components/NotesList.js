import React from "react";
import NoteItem from "./NoteItem";

// PUBLIC_INTERFACE
function NotesList({ notes, onEdit, onDelete, onTogglePinned, emptyState, formatTimestamp }) {
  /** Render list/grid of notes. */
  if (!notes.length) {
    return (
      <div className="EmptyState" role="status" aria-live="polite">
        <h3 className="EmptyState__title">{emptyState?.title || "Nothing here"}</h3>
        <p className="EmptyState__message">{emptyState?.message || "No items to display."}</p>
      </div>
    );
  }

  return (
    <div className="NotesGrid" aria-label="Notes list">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onEdit={() => onEdit(note.id)}
          onDelete={() => onDelete(note.id)}
          onTogglePinned={() => onTogglePinned(note.id)}
          formatTimestamp={formatTimestamp}
        />
      ))}
    </div>
  );
}

export default NotesList;
