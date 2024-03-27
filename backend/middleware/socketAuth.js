const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authorizeSocketRequest = asyncHandler(async (socket, next) => {
    console.log('authorizeSocketRequest is called');

    if(socket.handshake.headers.authorization && socket.handshake.headers.authorization.includes('Bearer ')) {

        // authorize jwt token and verify user exist in the db.
        let authToken = socket.handshake.headers.authorization;
        authToken = authToken.split(' ')[1];

        await jwt.verify(authToken, process.env.JWT_SECRET_KEY, async (err, data) => {
            if(err) {
                console.log('Socket.IO error: Unauthorized');
                return next(new Error('Unauthorized'));
            }
            if(data) {
                const user = await User.find().where('email').eq(data?.email).select('-password');
                socket.user = user[0];
                if(!user || user.length===0) {
                    console.log('Socket.IO error: User not exists');
                    return next(new Error('User not exists'));
                }
                
                next();
            }
        })
    }
    else {
        console.log('Socket.IO error: Unauthorized');
        return next(new Error('Unauthorized'));
    }
})

module.exports = { authorizeSocketRequest };