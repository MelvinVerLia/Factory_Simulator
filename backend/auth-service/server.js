require("dotenv").config();

const cors = require("cors");
const express = require("express");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json()); // Enables parsing of JSON request bodies

const port = process.env.port;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const response = await db.query(
      "INSERT INTO player(name, email, password) VALUES($1, $2, $3)",
      [name, email, password]
    );
    res.json(response.rows).status(200);
  } catch (error) {
    res.json(error.message).status(500);
    console.log(error);
  }
});

app.get("/player", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM player");
    res.json(response.rows).status(200);
  } catch (error) {
    res.json(error.message).status(500);
  }
});
