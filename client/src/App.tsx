import { FormEvent, MouseEvent, useEffect, useState } from "react";
import "./App.css";

interface Note {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes");
      const fetchedNotes: Note[] = await response.json();

      setNotes(fetchedNotes);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddNote = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newNote = await response.json();
      console.log(newNote);
      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickNote = (note: Note) => {
    setSelectedNote(note);

    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title,
            content,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updateNote = await response.json();
      const updatedNotesList = notes.map((note) =>
        note.id === selectedNote.id ? updateNote : note
      );

      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (err) {}
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleDelete = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    noteId: number
  ) => {
    event.stopPropagation(); //
    try {
      await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: "DELETE",
      });

      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="app-container">
        <form
          onSubmit={(event) => {
            selectedNote ? handleUpdateNote(event) : handleAddNote(event);
          }}
          className="note-form"
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(event) => {
              setTitle(event?.target.value);
            }}
          />
          <textarea
            value={content}
            onChange={(event) => {
              setContent(event?.target.value);
            }}
            placeholder="Content"
            rows={10}
          />

          {selectedNote ? (
            <div className="edit-buttons">
              <button type="submit">Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <button type="submit">Add note</button>
          )}
        </form>
        <div className="notes-grid">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                handleClickNote(note);
              }}
              className="note-item"
            >
              <div className="notes-header">
                <button
                  onClick={(event) => {
                    handleDelete(event, note.id);
                  }}
                >
                  X
                </button>
              </div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default App;
