import { AiOutlineEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import "./Note.css";

export default function Notes({ note, setIsEditing, setNoteToEdit, getData }) {
  const handleEdit = (e) => {
    e.preventDefault();
    // console.log('handling edit');
    // console.log("note", note);

    setIsEditing(true);
    setNoteToEdit(note);
  };
  const deleteItem = async function (e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVERURL}/notes/${note.id}`,
        { method: "DELETE" }
      );
      if (response.status === 200) {
        getData()
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="note">
      <div className="summary">
        <h3>{note.title}</h3>
        <p>{note.description}</p>
      </div>
      <div className="actions">
        <a href="" className="icon" onClick={handleEdit}>
          <AiOutlineEdit />
        </a>
        <a href="" className="icon" onClick={deleteItem}>
          <FaTrash />
        </a>
      </div>
    </div>
  );
}
