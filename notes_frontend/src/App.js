import React, { useMemo, useState } from "react";
import "./App.css";

import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";
import SearchBar from "./components/SearchBar";
import ConfirmDialog from "./components/ConfirmDialog";
import NoteEditorModal from "./components/NoteEditorModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { createNoteId } from "./utils/id";
import { formatDateTime } from "./utils/datetime";

const STORAGE_KEY = "notes_app.v1";

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {boolean} pinned
 * @property {number} createdAt
 * @property {number} updatedAt
 */

function normalizeLoadedNotes(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((n) => n && typeof n === "object")
    .map((n) => ({
      id: typeof n.id === "string" ? n.id : createNoteId(),
      title: typeof n.title === "string" ? n.title : "",
      body: typeof n.body === "string" ? n.body : "",
      pinned: Boolean(n.pinned),
      createdAt: typeof n.createdAt === "number" ? n.createdAt : Date.now(),
      updatedAt: typeof n.updatedAt === "number" ? n.updatedAt : Date.now(),
    }));
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[Note[], Function]} */
  const [notes, setNotes] = useLocalStorage(STORAGE_KEY, [], normalizeLoadedNotes);
  const [query, setQuery] = useState("");
  const [confirmState, setConfirmState] = useState({ open: false, noteId: null });
  const [editingNoteId, setEditingNoteId] = useState(null);

  const editingNote = useMemo(
    () => notes.find((n) => n.id === editingNoteId) || null,
    [notes, editingNoteId]
  );

  const filteredAndSortedNotes = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? notes.filter((n) => (n.title || "").toLowerCase().includes(q))
      : notes;

    // Sort: pinned first, then updatedAt desc
    return [...filtered].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, query]);

  const counts = useMemo(() => {
    const pinnedCount = notes.reduce((acc, n) => acc + (n.pinned ? 1 : 0), 0);
    return { total: notes.length, pinned: pinnedCount };
  }, [notes]);

  // PUBLIC_INTERFACE
  const addNote = ({ title, body }) => {
    const now = Date.now();
    const newNote = {
      id: createNoteId(),
      title: title.trim(),
      body: body.trim(),
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [newNote, ...prev]);
  };

  // PUBLIC_INTERFACE
  const requestDeleteNote = (noteId) => {
    setConfirmState({ open: true, noteId });
  };

  const confirmDeleteNote = () => {
    const noteId = confirmState.noteId;
    setConfirmState({ open: false, noteId: null });
    if (!noteId) return;
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const cancelDeleteNote = () => setConfirmState({ open: false, noteId: null });

  // PUBLIC_INTERFACE
  const togglePinned = (noteId) => {
    const now = Date.now();
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned, updatedAt: now } : n))
    );
  };

  // PUBLIC_INTERFACE
  const startEditNote = (noteId) => setEditingNoteId(noteId);

  const closeEditModal = () => setEditingNoteId(null);

  // PUBLIC_INTERFACE
  const saveEditedNote = ({ id, title, body }) => {
    const now = Date.now();
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              title: title.trim(),
              body: body.trim(),
              updatedAt: now,
            }
          : n
      )
    );
    setEditingNoteId(null);
  };

  return (
    <div className="App">
      <header className="TopBar">
        <div className="TopBar__inner">
          <div className="Brand">
            <div className="Brand__mark" aria-hidden="true">
              N
            </div>
            <div className="Brand__text">
              <h1 className="Brand__title">Notes</h1>
              <p className="Brand__subtitle">
                {counts.total} note{counts.total === 1 ? "" : "s"}
                {counts.pinned ? ` • ${counts.pinned} pinned` : ""}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="Page">
        <section className="Card Card--tight">
          <h2 className="SectionTitle">New note</h2>
          <NoteForm onAdd={addNote} />
        </section>

        <section className="Card">
          <div className="NotesHeader">
            <div className="NotesHeader__left">
              <h2 className="SectionTitle">Your notes</h2>
              <p className="SectionHint">
                Sorted by <strong>updated</strong> (pinned first).
              </p>
            </div>

            <div className="NotesHeader__right">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search by title…"
                ariaLabel="Search notes by title"
              />
            </div>
          </div>

          <NotesList
            notes={filteredAndSortedNotes}
            onEdit={startEditNote}
            onDelete={requestDeleteNote}
            onTogglePinned={togglePinned}
            emptyState={
              query.trim()
                ? {
                    title: "No matches",
                    message: `No notes match “${query.trim()}”. Try a different title search.`,
                  }
                : {
                    title: "No notes yet",
                    message: "Create your first note using the form above.",
                  }
            }
            formatTimestamp={formatDateTime}
          />
        </section>

        <footer className="Footer">
          <span className="Footer__text">Local-only • Saved in your browser ({STORAGE_KEY})</span>
        </footer>
      </main>

      <ConfirmDialog
        open={confirmState.open}
        title="Delete note?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteNote}
        onCancel={cancelDeleteNote}
      />

      <NoteEditorModal
        open={Boolean(editingNote)}
        note={editingNote}
        onClose={closeEditModal}
        onSave={saveEditedNote}
        formatTimestamp={formatDateTime}
      />
    </div>
  );
}

export default App;
