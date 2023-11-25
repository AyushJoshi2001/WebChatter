const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController');
const { authorizeUser } = require('../middleware/auth');
const router = express.Router();

router.post('/', authorizeUser, accessChat);
router.get('/fetch', authorizeUser, fetchChats);
router.post('/createGroup', authorizeUser, createGroupChat);
router.put('/renameChat', authorizeUser, renameGroup);
router.put('/remove', authorizeUser, removeFromGroup);
router.put('/add', authorizeUser, addToGroup);

module.exports = router;