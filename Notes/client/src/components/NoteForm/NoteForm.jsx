import { useState, useEffect } from "react";
import "./NoteForm.css";

// eslint-disable-next-line react/prop-types
export default function NoteForm({
  email,
  getData,
  isEditing,
  noteToEdit,
  setIsEditing,
}) {
  const [data, setData] = useState({
    email: email,
    title: "",
    description: "",
  });
  // console.log(data)

  // textarea auto-enlarge
  const tx = document.querySelectorAll("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute(
      "style",
      "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
    );
    tx[i].addEventListener("input", onInput, false);
  }
  function onInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  const handleChange = function (e) {
    const { name, value } = e.target;
    setData((prevData) => {
      // console.log(prevData)
      return {
        ...prevData,
        email: email,
        [name]: value,
      };
    });
    // console.log(data);
  };

  const postData = async function (e) {
    e.preventDefault();
    try {
      // console.log(data);
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVERURL}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        // console.log("FINALLY");
        setData({
          email: email,
          title: "",
          description: "",
        });
        getData();
        tx.style.scrollHeight = `${1.4}rem`;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setData({
      email: noteToEdit.email,
      title: noteToEdit.title,
      description: noteToEdit.description,
    });

    // console.log("edit value", isEditing);
    // console.log(data);
  }, [noteToEdit]);

  const editData = async function (e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVERURL}/notes/${noteToEdit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        // console.log("FINALLY Edit Worked");
        getData();
        setIsEditing(false);
        setData({
          email: email,
          title: "",
          description: "",
        });
      }
      // console.log(notes)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="write-section">
      <div className="noteform">
        <input
          type="text"
          name="title"
          id="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <textarea
          name="description"
          id="description"
          value={data.description}
          onChange={handleChange}
          placeholder="Description"
        ></textarea>
        <input
          type="submit"
          value={isEditing ? "Edit" : "Create"}
          className="a"
          onClick={isEditing ? editData : postData}
        />
      </div>
    </section>
  );
}
