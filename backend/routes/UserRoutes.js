const express = require('express');
const router = express.Router();
const { getProfile, searchUser } = require('../controllers/userControllers');

router.get('/getProfile', getProfile);

router.get('/search', searchUser);

module.exports = router;