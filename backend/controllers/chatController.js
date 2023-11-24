const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const accessChat = asyncHandler(async (req, res, next) => {
    console.log('accessChat is called');
    
    const ownerId = req.user?._id;
    const partnerId = req.body?.userId;
    if(!partnerId) {
        res.status(400).json('UserId not found');
    }
    const partnerExist = await User.find({_id : partnerId});
    if(!partnerExist || partnerExist.length===0) {
        res.status(400).json('User not found');
    }

    let chatData = Chat.find({
        isGroupChat: false,
        $and : [
            { participants: { $elemMatch: { $eq: ownerId } } },
            { participants: { $elemMatch: { $eq: partnerId } } }
        ]
    })
    .populate('participants', '-password')
    .populate('latestMessage');

    chatData = await User.populate(chatData, {
        path: 'latestMessage.sender',
        select: 'name email profileImg'
    });

    if(chatData.length>0) {
        res.status(200).json(chatData[0]);
    } else {
        let chatData = {
            chatName: 'sender',
            isGroupChat: false,
            participants: [ownerId, partnerId]
        }

        try {
            const createdChat = await Chat.create(chatData);

            const newlyCreatedChat = await Chat.findOne({ _id: createdChat._id }).populate('participants', '-password');
            res.status(200).json(newlyCreatedChat);
        } catch(err) {
            res.status(400);
            throw new Error(err.message);
        }
    }
})

const fetchChats = asyncHandler(async (req, res, next) => {
    console.log('fetchChats is called');

})

const createGroupChat = asyncHandler(async (req, res, next) => {
    console.log('createGroupChat is called');

})

const renameGroup = asyncHandler(async (req, res, next) => {
    console.log('renameGroup is called');

})

const removeFromGroup = asyncHandler(async (req, res, next) => {
    console.log('removeFromGroup is called');

})

const addToGroup = asyncHandler(async (req, res, next) => {
    console.log('addToGroup is called');

})

module.exports = { 
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
}