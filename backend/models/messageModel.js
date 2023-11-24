const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    chatInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;