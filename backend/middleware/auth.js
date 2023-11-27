const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authorizeUser = asyncHandler(async (req, res, next) => {
    console.log('authorizeUser is called');

    if(req.headers.authorization && req.headers.authorization.includes('Bearer ')) {

        // authorize jwt token and verify user exist in the db.
        let authToken = req.headers.authorization;
        authToken = authToken.split(' ')[1];

        await jwt.verify(authToken, process.env.JWT_SECRET_KEY, async (err, data) => {
            if(err) {
                console.log('Unauthorized access.');
                res.status(403).json('Unauthorized');
            }
            if(data) {
                const user = await User.find().where('email').eq(data?.email).select('-password');
                req.user = user[0];
                if(!user || user.length===0) {
                    res.status(400).json('User not exists');
                }
                
                next();
            }
        })
    }
    else {
        console.log('Unauthorized access.');
        res.status(403).json('Unauthorized')
    }
})

module.exports = { authorizeUser };