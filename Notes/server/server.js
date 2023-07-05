// const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const pool = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(express.json());

// Get all notes
app.get("/notes/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const notes = await pool.query("SELECT * FROM notes WHERE email = $1", [
      email,
    ]);
    res.json(notes.rows);
  } catch (error) {
    console.error(error);
  }
});

// Create a new todo
app.post("/notes", async (req, res) => {
  console.log(req.body);
  const id = uuidv4();
  const { email, title, description } = req.body;
  console.log(req.body);
  try {
    const newNote = await pool.query(
      "INSERT INTO notes(id, email, title, description) VALUES ($1, $2, $3, $4)",
      [id, email, title, description]
    );
    res.json(newNote);
  } catch (error) {
    console.error(error);
  }
});

//Edit a note
app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { email, title, description } = req.body;

  try {
    const editNote = await pool.query(
      "UPDATE notes SET email=$1, title=$2, description=$3 WHERE id=$4;",
      [email, title, description, id]
    );
    res.json(editNote.rows);
  } catch (error) {
    console.error(error);
  }
});

// Delete a note
app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM notes WHERE id=$1", [id]);
    res.json(deleteTodo);
  } catch (error) {
    console.log(error);
    res.json({ detail: error.detail });
  }
});

//signup

app.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  username = username.replace(/"/g, "'");
  email = email.replace(/"/g, "'");
  hashedPassword = hashedPassword.replace(/"/g, "'");

  console.log(username, email, hashedPassword);
  try {
    const signUp = await pool.query(
      "INSERT INTO users (username, email, hash) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ email, token });
  } catch (error) {
    console.error(error);
  }
});

//login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!user.rows.length) return res.json({ detail: "User Does Not Exist" });
    const success = await bcrypt.compare(password, user.rows[0].hash);
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    if (success) {
      res.json({
        email: user.rows[0].email,
        token,
        username: user.rows[0].username,
      });
    } else {
      res.json({ detail: "User Or Password is Incorrect" });
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/", (req, res) => {
  res.send("Notes App is working");
});

app.listen(5070, () => console.log(`Server Running on PORT ${5070}`));
