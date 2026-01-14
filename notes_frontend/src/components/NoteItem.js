import React, { useMemo } from "react";

function makePreview(text) {
  return (text || "").trim();
}

// PUBLIC_INTERFACE
function NoteItem({ note, onEdit, onDelete, onTogglePinned, formatTimestamp }) {
  /** Presentational note card with actions. */
  const updated = useMemo(() => formatTimestamp?.(note.updatedAt) || "", [formatTimestamp, note.updatedAt]);
  const preview = useMemo(() => makePreview(note.body), [note.body]);

  return (
    <article className={`NoteCard ${note.pinned ? "NoteCard--pinned" : ""}`}>
      <header className="NoteHeader">
        <div>
          <h3 className="NoteTitle">{note.title?.trim() ? note.title : "Untitled"}</h3>
          <p className="NoteMeta">Updated {updated}</p>
        </div>

        <button
          type="button"
          className="Btn Btn--ghost"
          onClick={onTogglePinned}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          title={note.pinned ? "Unpin" : "Pin"}
        >
          {note.pinned ? "Pinned" : "Pin"}
        </button>
      </header>

      <p className={`NoteBody ${preview ? "NoteBody--preview" : ""}`}>
        {preview ? preview : <span className="HelpText">No content</span>}
      </p>

      <div className="NoteActions">
        <button type="button" className="Btn" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="Btn Btn--danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default NoteItem;
