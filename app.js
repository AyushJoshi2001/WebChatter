const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const port = process.env.port || 5000;
app.use(express.static("/public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json("working fine...");
})

app.listen(port ,() => {
  console.log(`Server is running on port:${port}...`);
})