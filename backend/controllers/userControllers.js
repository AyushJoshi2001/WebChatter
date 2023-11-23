const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const getProfile = asyncHandler(async (req, res, next) => {
    console.log('getProfile is called');

    const userEmail = req.user?.email;
    const user = await User.findOne({ email : userEmail }, { password: 0 });
    if(!user) {
        res.status(400).json('User not found.');
    }
    res.status(200).json(user);
})

const searchUser = asyncHandler(async (req, res, next) => {
    console.log('searchUser is called');

    const searchKey = req.query.searchKey;
    let pageNo = req.query.pageNo;
    let pageSize = req.query.pageSize;
    if(!pageNo) {
        pageNo = 1;
    }
    if(!pageSize) {
        pageSize = 10;
    }
    const users = await User.find({ 
        $or: [
            {'email': { $regex: '^' + searchKey, $options:'i' }}, 
            {'name': { $regex: '^' + searchKey, $options:'i' }}
        ]})
        .find({
            email: {
                $ne: req.user?.email
            }
        })
        .select('-password')
        .skip((pageNo-1)*pageSize)
        .limit(pageSize);
        
    res.status(200).json(users);
})

module.exports = { 
    getProfile, 
    searchUser 
}