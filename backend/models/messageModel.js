const mongoose = require('mongoose');
const User = require('./userModel');
const Chat = require('./chatModel');

const messageModel = mongoose.Schema(
    {
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    content: {
        type: String,
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Chat
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})

const Message = mongoose.model('Message', messageModel);
module.exports = Message;