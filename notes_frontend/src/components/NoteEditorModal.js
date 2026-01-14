import React, { useEffect, useMemo, useState } from "react";

function useEscapeToClose(open, onClose) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
}

// PUBLIC_INTERFACE
function NoteEditorModal({ open, note, onClose, onSave, formatTimestamp }) {
  /** Modal to edit a note. */
  useEscapeToClose(open, onClose);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!open || !note) return;
    setTitle(note.title || "");
    setBody(note.body || "");
  }, [open, note]);

  const canSave = useMemo(() => title.trim().length > 0 || body.trim().length > 0, [title, body]);

  if (!open || !note) return null;

  const updated = formatTimestamp?.(note.updatedAt) || "";

  const submit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ id: note.id, title, body });
  };

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="ModalOverlay" role="presentation" onMouseDown={onOverlayClick}>
      <div className="Modal" role="dialog" aria-modal="true" aria-label="Edit note">
        <div className="ModalHeader">
          <div className="ModalTitleWrap">
            <h3 className="ModalTitle">Edit note</h3>
            <p className="ModalSubtitle">Last updated {updated}</p>
          </div>
          <button type="button" className="Btn Btn--ghost" onClick={onClose} aria-label="Close editor">
            Close
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="ModalBody">
            <div className="FieldRow">
              <input
                className="Input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                maxLength={120}
                aria-label="Edit note title"
                autoFocus
              />
              <textarea
                className="Textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write something…"
                maxLength={4000}
                aria-label="Edit note body"
              />
              <p className="HelpText">Saving updates the “updated” timestamp.</p>
            </div>
          </div>

          <div className="ModalFooter">
            <button type="button" className="Btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="Btn Btn--primary" disabled={!canSave}>
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteEditorModal;
