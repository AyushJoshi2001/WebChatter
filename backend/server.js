require('dotenv').config(); // used for loading .env file to process.env
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { authorizeUser } = require('./middleware/auth');
const User = require('./models/userModel');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

mongoose.connect(process.env.MONGODB_DATABASE_URI);

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use(authorizeUser);
app.use('/api/user', userRoutes);

app.listen(process.env.PORT || 5000 ,() => {
  console.log(`Server is running on port:${process.env.PORT || 5000}...`);
})