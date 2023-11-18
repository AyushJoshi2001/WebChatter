require('dotenv').config(); // used for loading .env file to process.env
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const User = require('./models/userModel');

mongoose.connect(process.env.MONGODB_DATABASE_URI);

app.use(bodyParser.json());
app.use('/api/user', userRoutes);
app.get('/api/getUsers', async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

app.listen(process.env.PORT || 5000 ,() => {
  console.log(`Server is running on port:${process.env.PORT || 5000}...`);
})