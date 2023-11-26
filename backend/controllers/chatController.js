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

    if(chatData && chatData.length>0) {
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

    let chats = await Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
        .populate('participants', '-password')
        .populate('latestMessage')
        .populate('groupAdmin', '-password')
        .sort({ updatedAt: -1 });

    chats = await Chat.populate(chats, {
        path: 'latestMessage.sender',
        select: 'name email profileImg'
    });

    res.status(200).json(chats);
})

const createGroupChat = asyncHandler(async (req, res, next) => {
    console.log('createGroupChat is called');
    
    const groupMembers = req.body.groupMembers;
    const groupName = req.body.groupName;
    if(!groupMembers || groupMembers.length<2) {
        res.status(400).json('Atleast 3 member needed to create a group chat');
    }
    if(!groupName) {
        res.status(400).json('Group name not found');
    }

    let groupChatDetails = {
        chatName: groupName,
        isGroupChat: true,
        participants: groupMembers,
        groupAdmin: req.user._id
    }

    const groupChatCreated = await Chat.create(groupChatDetails);
    const getNewlyCreatedGroup = await Chat.find({ _id : groupChatCreated?._id })
    .populate('participants', '-password')
    .populate('groupAdmin', '-password');
    
    res.status(200).json(getNewlyCreatedGroup);
})

const renameGroup = asyncHandler(async (req, res, next) => {
    console.log('renameGroup is called');
    
    const groupId = req.body.groupId;
    const groupName = req.body.groupName;

    if(!groupId) {
        res.status(400).json('GroupId is missing');
    }
    if(!groupName) {
        res.status(400).json('Group Name is missing');
    }

    const getGroupDetails = await Chat.find({ _id: groupId });
    if(!getGroupDetails || getGroupDetails.length===0) {
        res.status(400).json('Group not found');
    }

    let updateGroupDetails = await Chat.findOneAndUpdate({ _id: groupId, isGroupChat: true, groupAdmin: req.user._id }, { chatName: groupName }, { new: true });
    if(!updateGroupDetails) {
        res.status(400).json('Something went wrong');
    }
    updateGroupDetails = await Chat.populate(updateGroupDetails,[
        {
            path: 'participants',
            select: '-password'
        },
        {
            path: 'groupAdmin',
            select: '-password'
        }
    ]);

    res.status(200).json(updateGroupDetails);
})

const removeFromGroup = asyncHandler(async (req, res, next) => {
    console.log('removeFromGroup is called');

    const userId = req.body.userId;
    const groupId = req.body.groupId;
    if(!userId) {
        res.status(400).json('userId is missing');
    }
    if(!groupId) {
        res.status(400).json('groupId is missing');
    }

    let removeMemberFromGroup = await Chat.findOneAndUpdate(
        { _id: groupId, isGroupChat: true, groupAdmin: req.user._id }, 
        { $pull: { participants: userId } }, { new: true }
    );

    if(!removeMemberFromGroup) {
        res.status(400).json('Something went wrong');
    }

    removeMemberFromGroup = await Chat.populate(removeMemberFromGroup,[
        {
            path: 'participants',
            select: '-password'
        },
        {
            path: 'groupAdmin',
            select: '-password'
        }
    ]);

    res.status(200).json(removeMemberFromGroup);
})

const addToGroup = asyncHandler(async (req, res, next) => {
    console.log('addToGroup is called');

    const userId = req.body.userId;
    const groupId = req.body.groupId;
    if(!userId) {
        res.status(400).json('userId is missing');
    }
    if(!groupId) {
        res.status(400).json('groupId is missing');
    }

    const userDetails = await User.find({ _id: userId });
    if(!userDetails || userDetails.length===0) {
        res.status(400).json('User not found');
    } 

    let addMemberToGroup = await Chat.findOneAndUpdate(
        { _id: groupId, isGroupChat: true, groupAdmin: req.user._id }, 
        { $addToSet: { participants: userId } }, { new: true }
    );

    if(!addMemberToGroup) {
        res.status(400).json('Something went wrong');
    }

    addMemberToGroup = await Chat.populate(addMemberToGroup,[
        {
            path: 'participants',
            select: '-password'
        },
        {
            path: 'groupAdmin',
            select: '-password'
        }
    ]);

    res.status(200).json(addMemberToGroup);
})

module.exports = { 
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
}