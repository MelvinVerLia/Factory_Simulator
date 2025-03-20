require("dotenv").config();

const {
  insertResource,
  resourceNormalize,
} = require("./controller/IdleController");
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

app.post("/get/resource", insertResource);

setInterval(() => {
  console.log("Price Updated");
  resourceNormalize();
}, 2 * 60 * 1000);
