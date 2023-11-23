const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController');
const { authorizeUser } = require('../middleware/auth');
const router = express.Router();

const accessChat = router.get('/accessChat', authorizeUser, accessChat);
const fetchChats = router.get('/fetchChats', authorizeUser, fetchChats);
const createGroupChat = router.get('/createGroupChat', authorizeUser, createGroupChat);
const renameGroup = router.get('/renameGroup', authorizeUser, renameGroup);
const removeFromGroup = router.get('/removeFromGroup', authorizeUser, removeFromGroup);
const addToGroup = router.get('/addToGroup', authorizeUser, addToGroup);

module.exports = router;