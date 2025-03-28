require("dotenv").config();

const {
  selectAllFactories,
  buyFactory,
  insertQueue,
} = require("./controller/FactoryController");
const { scheduleNextProcessing } = require("./repository/FactoryRepository");
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

scheduleNextProcessing();

app.get("/factory", selectAllFactories);

app.post("/buy/factory", buyFactory);

app.post("/factory/process", insertQueue);

