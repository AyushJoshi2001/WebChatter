require('dotenv').config(); // used for loading .env file to process.env
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

mongoose.connect(process.env.MONGODB_DATABASE_URI);

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.listen(process.env.PORT || 5000 ,() => {
  console.log(`Server is running on port:${process.env.PORT || 5000}...`);
})