const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const saveMessage = asyncHandler(async (req, res, next) => {
    console.log('saveMessage is called');

    try {
        const { chatId, content } = req.body;
        if(!chatId) {
            throw new Error('chatId is missing');
        }
        if(!content) {
            throw new Error('content is missing');
        }

        const chat = await Chat.find(
            { 
                _id: chatId,
                $or: [
                    { participants: { $elemMatch: { $eq: req.user._id } } },
                    { groupAdmin: req.user._id }
                ]  
            
            }
        );

        if(!chat || chat.length===0) {
            throw new Error('Chat not found with the given id');
        }

        const messageObj = {
            sender: req.user._id,
            content: content,
            chatInfo: chatId
        }

        let saveMessageToDB = await Message.create(messageObj);
        saveMessageToDB = await Message.populate(saveMessageToDB, [
            {
                path: 'sender',
                select: '-password'
            },
            {
                path: 'chatInfo'
            }
        ]);
        saveMessageToDB = await User.populate( saveMessageToDB,
            {
                path: 'chatInfo.participants',
                select: '-password'
            }
        );

        const currentTime = Date.now();
        await Chat.findByIdAndUpdate(chatId, { latestMessage: saveMessageToDB._id, updatedAt: currentTime } );
        res.status(200).json(saveMessageToDB); 
    } catch(err) {
        console.log(err);
        res.status(400).json(err.message);
    }
})

const getMessages = asyncHandler(async (req, res, next) => {
    console.log('getMessages is called');

    try{
        const chatId = req.params.chatId;
        let pageNo = req.query.pageNo;
        let pageSize = req.query.pageSize;
        if(!chatId) {
            throw new Error('chatId is missing');
        }
        if(!pageNo) {
            pageNo = 1;
        }
        if(!pageSize) {
            pageSize = 10;
        }

        const chat = await Chat.find(
            { 
                _id: chatId,
                $or: [
                    { participants: { $elemMatch: { $eq: req.user._id } } },
                    { groupAdmin: req.user._id }
                ]  
            
            }
        );

        if(!chat || chat.length===0) {
            throw new Error('Chat not found with the given id');
        }

        const messages = await Message.find({ chatInfo: chatId })
            .sort({createdAt: -1})
            .skip((pageNo-1)*pageSize)
            .limit(pageSize)
            .populate('sender', '-password');

        res.status(200).json(messages);
    } catch(err) {
        console.log(err);
        res.status(400).json(err.message);
    }  
})

module.exports = {
    saveMessage,
    getMessages
}