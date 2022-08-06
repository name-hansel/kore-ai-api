const express = require("express");

const connectToDatabase = require("./config/database");

const app = express();
require("dotenv").config();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectToDatabase();

app.get("/", (req, res) => {
  res.send("Hello");
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})