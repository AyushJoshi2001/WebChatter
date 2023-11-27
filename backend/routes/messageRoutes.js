const express = require('express');
const { authorizeUser } = require('../middleware/auth');
const { saveMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

router.post('/', authorizeUser, saveMessage);
router.get('/:chatId', authorizeUser, getMessages);

module.exports = router;