const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup, updateChatDetails } = require('../controllers/chatController');
const { authorizeUser } = require('../middleware/auth');
const router = express.Router();

router.post('/', authorizeUser, accessChat);
router.get('/', authorizeUser, fetchChats);
router.post('/createGroup', authorizeUser, createGroupChat);
router.put('/renameChat', authorizeUser, renameGroup);
router.put('/remove', authorizeUser, removeFromGroup);
router.put('/add', authorizeUser, addToGroup);
router.put('/update', authorizeUser, updateChatDetails);

module.exports = router;