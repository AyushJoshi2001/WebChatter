const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userControllers');

router.get('/getProfile', getProfile)

module.exports = router;