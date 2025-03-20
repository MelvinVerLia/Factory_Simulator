require("dotenv").config();

const cors = require("cors");
const express = require("express");
const db = require("./db/index");

const app = express();

app.use(cors());
app.use(express.json()); // Enables parsing of JSON request bodies

const port = process.env.port;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.post("/get/resource", (req, res) => {
  try {
    
  } catch (error) {}
});
