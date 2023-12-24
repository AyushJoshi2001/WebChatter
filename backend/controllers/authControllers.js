const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const SALT_VAL=10;

const registerUser = asyncHandler(async (req, res) => {
    console.log('registerUser is called');
    const { name, email, password, profileImg } = req.body;

    if(!name || !email || !password) {
        if(!name) {
            res.status(400).json('Name is missing.');
        }
        if(name.length<3) {
            res.status(400).json('Name should have atleast 3 characters.');
        }
        if(!email) {
            res.status(400).json('Email is missing.');
        }
        if(!password) {
            res.status(400).json('Password is missing.');
        }
    }

    // checking user exists.
    const isUserAlreayExist = await User.exists({email: email});
    if(isUserAlreayExist) {
        res.status(400).json('User already exist.');
    }

    // encrypting the password
    const encryptedPassword = await bcrypt.hash(password, SALT_VAL);

    // save details to DB.
    const user = new User({name: name, email: email, password: encryptedPassword});
    const savedUser = await user.save();
    let userObj = savedUser.toObject();
    delete userObj.password;
    res.status(200).json(userObj);
})

const loginUser = asyncHandler(async (req, res) => {
    console.log('loginUser is called');
    const { email, password } = req.body;

    if(!email || !password) {
        if(!email) {
            res.status(400).json('Email is missing.');
        }
        if(!password) {
            res.status(400).json('Password is missing.');
        }
    }

    // fetching user details.
    const user = await User.find().where('email').equals(email);

    if(!user || (user && user.length===0)) {
        res.status(404).json('User not found');
    }
    if(user && user.length>1) {
        res.status(400).json('Duplicate user found');
    }

    let userObj = user[0];

    // authenticating user's email and password.
    const validateUser = await bcrypt.compare(password, userObj?.password);
    if(!validateUser) {
        res.status(401).json('Email or Password invalid');
    }

    // generating jwt token.
    const token = await jwt.sign({
        email: userObj?.email,
        name: userObj?.name
    },
    process.env.JWT_SECRET_KEY,
    {
        expiresIn: '24h' // 24 hours
    })

    // sending jwt token.
    res.status(200).json(token);
})


module.exports = { 
    registerUser, 
    loginUser 
};