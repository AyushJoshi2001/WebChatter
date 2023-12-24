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

const updateProfile = asyncHandler(async (req, res, next) => {
    console.log('updateProfile is called');
    
    const user = req.user;
    const name = req.body.name;
    const profileImg = req.body.profileImg;

    if(!name || name.length<3) {
        res.status(400).json('Name should have atleast 3 characters');
    }
    const userData = await User.findByIdAndUpdate(user._id, { name: name, profileImg: profileImg }, { new: true });
    if(!userData) {
        res.status(400).json('User not found');
    }
    res.status(200).json(userData);
})

module.exports = { 
    getProfile, 
    searchUser,
    updateProfile
}