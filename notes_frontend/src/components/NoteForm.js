import React, { useMemo, useState } from "react";

// PUBLIC_INTERFACE
function NoteForm({ onAdd }) {
  /** Form to add a new note (title + body). */
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const canSave = useMemo(() => title.trim().length > 0 || body.trim().length > 0, [title, body]);

  const submit = (e) => {
    e.preventDefault();
    if (!canSave) return;

    onAdd({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={submit} className="FieldRow" aria-label="Add a new note">
      <input
        className="Input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={120}
        aria-label="Note title"
      />
      <textarea
        className="Textarea"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something…"
        maxLength={4000}
        aria-label="Note body"
      />
      <div className="Actions">
        <p className="HelpText" aria-live="polite">
          {canSave ? "Tip: Press Save to add it." : "Add a title or body to save."}
        </p>
        <button className="Btn Btn--primary" type="submit" disabled={!canSave}>
          Save note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
