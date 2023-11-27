const express = require('express');
const router = express.Router();
const { getProfile, searchUser } = require('../controllers/userControllers');
const { authorizeUser } = require('../middleware/auth');

router.get('/getProfile', authorizeUser, getProfile);
router.get('/search', authorizeUser, searchUser);

module.exports = router;