import Navigation from "./components/Navigation/Navigation";
import NoteForm from "./components/NoteForm/NoteForm";
import Note from "./components/Note/Note";
import Auth from "./components/Auth/Auth";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "./App.css";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [notes, setNotes] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState({});
  const [loginName, setLoginName] = useState("");
  const [loading, setLoading] = useState(false);

  const email = cookies.Email;
  const authToken = cookies.AuthToken;

  const getData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVERURL}/notes/${email}`
      );
      const json = await response.json();
      setNotes(json);
      setLoading(false);
      // console.log(notes);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };
  // console.log(notes);
  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);

  return (
    <div className="app">
      {!authToken && <Auth setLoginName={setLoginName} />}
      {authToken && (
        <>
          <Navigation loginName={loginName} />
          <NoteForm
            email={email}
            getData={getData}
            isEditing={isEditing}
            noteToEdit={noteToEdit}
            setIsEditing={setIsEditing}
          />
          {loading && (
            <h2
              style={{
                textAlign: "center",
                color: "var(--heading-color)",
                margin: "1rem",
              }}
            >
              Loading...
            </h2>
          )}
          <section id="note-section">
            {notes?.map((note) => (
              <Note
                key={note.id}
                note={note}
                getData={getData}
                setIsEditing={setIsEditing}
                setNoteToEdit={setNoteToEdit}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
}

export default App;
