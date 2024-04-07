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
const { isUserExistInChat } = require('./controllers/chatController');
const { addMessageFromSocket } = require('./controllers/messageController');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['PUT, POST, DELETE, GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  pingTimeout: 60000 // if client doesn't respond within 60 seconds then close the connection
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
  
  socket.on('join-user-room', (userId) => {
    console.log('user joined => ', userId);
    socket.join(userId);
  });

  socket.on('leave-user-room', (userId) => {
    console.log('user left => ', userId);
    socket.leave(userId);
  });

  socket.on('join-chat-room', (chatId) => {
    if(isUserExistInChat(chatId, socket.user._id)) {
      console.log('chat room joined => ', chatId);
      socket.join(chatId);
    }
  });

  socket.on('leave-chat-room', (chatId) => {
    console.log('chat room left => ', chatId);
    socket.leave(chatId);
  });

  socket.on('new-message', async (data) => {
    console.log('new message event called');
    const chat = await isUserExistInChat(data.chatId, socket.user._id);
    if(chat) {
      const savedMessageObj = await addMessageFromSocket(data.chatId, data.content, socket.user._id);
      io.to(data.chatId).emit('received-new-message', savedMessageObj);
      
      const updatedChatData = {
        chatId: data.chatId,
        content: data.content,
        updatedAt: savedMessageObj.createdAt
      }
      // Notify all the participants.
      if(chat.participants) {
        for(let participantId of chat.participants) {
          if(socket.user._id.toString() != participantId.toString()) {
            io.to(participantId.toString()).emit('chat-update', updatedChatData);
          }
        }
      }
    }
  });
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

io.on('error', (error) => {
  console.error('Socket.IO error123:', error);
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port:${process.env.PORT || 5000}...`);
});