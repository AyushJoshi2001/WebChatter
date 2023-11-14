const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config(); // used for loading .env file to process.env
const port = process.env.port || 5000;
const userRoutes = require('./routes/UserRoutes');

app.use(bodyParser.json());

app.use('/api/user', userRoutes);

app.listen(port ,() => {
  console.log(`Server is running on port:${port}...`);
})