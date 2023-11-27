require('dotenv').config(); // used for loading .env file to process.env
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

mongoose.connect(process.env.MONGODB_DATABASE_URI).then(() => {
  console.log('Connected to the database');
}).catch(err => {
  console.log('Error during database connection => ', err);
});

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.listen(process.env.PORT || 5000 ,() => {
  console.log(`Server is running on port:${process.env.PORT || 5000}...`);
})