const express = require('express');
const router = express.Router();
const { getProfile, searchUser, updateProfile } = require('../controllers/userControllers');
const { authorizeUser } = require('../middleware/auth');

router.get('/getProfile', authorizeUser, getProfile);
router.get('/search', authorizeUser, searchUser);
router.put('/update', authorizeUser, updateProfile);

module.exports = router;