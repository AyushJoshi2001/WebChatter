const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
    {
        chatName: {
            type: String,
            required: true
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        groupImg: {
            type: String,
            default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCJKM1YzdZZGiPEnxzk9qYuWXQN_3PRzmlAsr3I6YrRPM7a18OO3X4rXnQUNDrWlJkcLo&usqp=CAU'
        },
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: () => Date.now()
        },
        updatedAt: {
            type: Date,
            default: () => Date.now()
        }

    }
)

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;