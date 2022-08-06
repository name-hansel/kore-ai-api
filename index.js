const express = require("express");

const connectToDatabase = require("./config/database");
const router = require("./routes/order")

const app = express();
require("dotenv").config();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectToDatabase();

app.use("/api", router);

app.get("*", (req, res) => {
  res.send("404 Not Found");
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})