const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const getProfile = asyncHandler(async (req, res, next) => {
    console.log('getProfile is called');
    const userEmail = req.headers.loggedInUserEmail;
    const user = await User.findOne({ email : userEmail }, { password: 0 });

    if(!user) {
        res.status(400).json('User not found.');
    }
    res.status(200).json(user);
})

module.exports = { getProfile }