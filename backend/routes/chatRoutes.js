const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController');
const { authorizeUser } = require('../middleware/auth');
const router = express.Router();

router.get('/accessChat', authorizeUser, accessChat);
router.get('/fetchChats', authorizeUser, fetchChats);
router.post('/createGroupChat', authorizeUser, createGroupChat);
router.post('/renameGroup', authorizeUser, renameGroup);
router.put('/removeFromGroup', authorizeUser, removeFromGroup);
router.put('/addToGroup', authorizeUser, addToGroup);

module.exports = router;