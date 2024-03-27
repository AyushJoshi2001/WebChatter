require('dotenv').config(); // used for loading .env file to process.env
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const http = require("http");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const allowCrossDomain = require('./utils/corsHandler');
const { authorizeSocketRequest } = require('./middleware/socketAuth');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['PUT, POST, DELETE, GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

mongoose.connect(process.env.MONGODB_DATABASE_URI).then(() => {
  console.log('Connected to the database');
}).catch(err => {
  console.log('Error during database connection => ', err);
});

app.use(bodyParser.json());
app.use('*', allowCrossDomain);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

io.use(authorizeSocketRequest);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('new-message', (data) => {
    console.log('new message => ', data);
    socket.emit('recieved-new-message', data);
  })
})

io.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port:${process.env.PORT || 5000}...`);
})